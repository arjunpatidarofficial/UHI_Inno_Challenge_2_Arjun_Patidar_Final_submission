package in.healthtalk.patientTest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import com.github.barteksc.pdfviewer.PDFView;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.PermissionListener;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import in.healthtalk.patientTest.adapter.PdfDocumentAdapter;


public class ViewPdfActivity extends AppCompatActivity {

    FirebaseStorage storage=FirebaseStorage.getInstance();

    StorageReference presRef;

    PDFView pdfView;
    ImageView close;

    ProgressBar progressbar;
    String appointId;
    Button download;
    TextView notFound;
    String url;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_pdf);

        appointId=getIntent().getStringExtra("appointId");

        DocumentReference appRef  = FirebaseFirestore.getInstance().collection("appointment").document(appointId);


        pdfView=findViewById(R.id.pdf);
        close=findViewById(R.id.close);
        progressbar=findViewById(R.id.progressbar);
        download=findViewById(R.id.download);
        notFound=findViewById(R.id.notFound);

        appRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot snapshot, @Nullable FirebaseFirestoreException error) {
               url = (String) snapshot.get("precribtionUrl");
                presRef = storage.getReferenceFromUrl(url);

                download.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        presRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                            @Override
                            public void onSuccess(Uri uri) {
                                //downloadFile(ViewPdfActivity.this,appointId,".pdf",uri);

                                String fileName= "/"+appointId+".pdf";
                                StartNewDownload(uri,fileName);


                            }
                        });
                    }
                });

                presRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                    @Override
                    public void onSuccess(Uri uri) {
                        new RetrievePdfSteam().execute(uri.toString());
                        progressbar.setVisibility(View.GONE);
                        download.setVisibility(View.VISIBLE);
                        notFound.setVisibility(View.GONE);

                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        progressbar.setVisibility(View.GONE);
                        notFound.setVisibility(View.VISIBLE);
                        download.setVisibility(View.GONE);
                    }
                });

                close.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        finish();
                    }
                });
            }
        });




    }

    class RetrievePdfSteam extends AsyncTask<String, Void, InputStream> {

        @Override
        protected InputStream doInBackground(String... strings) {
            InputStream inputStream=null;
            try {
                URL url=new URL(strings[0]);
                HttpURLConnection urlConnection=(HttpURLConnection)url.openConnection();
                if (urlConnection.getResponseCode() == 200){
                    inputStream=new BufferedInputStream(urlConnection.getInputStream());
                }

            }catch (IOException e){
                return null;
            }
            return inputStream;
        }

        @Override
        protected void onPostExecute(InputStream inputStream) {
            pdfView.fromStream(inputStream).load();
        }
    }

    public void StartNewDownload(Uri uri,String fileName) {

        progressbar.setVisibility(View.VISIBLE);

        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + fileName);
        if (file.exists()){
            file.delete();
        }
        DownloadManager.Request request = new DownloadManager.Request(uri);
        request.setDescription("Prescription successfully download");
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
        DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);

        manager.enqueue(request);

        int SPLASH_TIME_OUT=1000;

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Dexter.withActivity(ViewPdfActivity.this)
                        .withPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        .withListener(new PermissionListener() {
                            @RequiresApi(api = Build.VERSION_CODES.KITKAT)
                            @Override
                            public void onPermissionGranted(PermissionGrantedResponse response) {
                                if (file.exists()){
                                    printPdf();
                                }else {
                                    progressbar.setVisibility(View.GONE);
                                    Toast.makeText(ViewPdfActivity.this, "Downlaoding failed please try again", Toast.LENGTH_SHORT).show();
                                }
                            }

                            @Override
                            public void onPermissionDenied(PermissionDeniedResponse response) {
                                progressbar.setVisibility(View.GONE);

                            }

                            @Override
                            public void onPermissionRationaleShouldBeShown(PermissionRequest permission, PermissionToken token) {
                                progressbar.setVisibility(View.GONE);

                            }
                        })
                        .check();

            }

        },SPLASH_TIME_OUT);


    }


    private boolean isFileExists(String filename){
        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + filename);
        return file.exists();

    }



    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private void printPdf() {
        PrintManager printManager= (PrintManager)getSystemService(Context.PRINT_SERVICE);
        try {
            PrintDocumentAdapter printDocumentAdapter=new PdfDocumentAdapter(ViewPdfActivity.this,appointId);
            printManager.print("Document",printDocumentAdapter,new PrintAttributes.Builder().build());
            progressbar.setVisibility(View.GONE);

        }catch (Exception ex){
            Log.e("Nuvocliniq",""+ex.getMessage());
            progressbar.setVisibility(View.GONE);

        }

    }

}