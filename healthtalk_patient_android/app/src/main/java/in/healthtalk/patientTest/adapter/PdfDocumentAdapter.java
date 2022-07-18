package in.healthtalk.patientTest.adapter;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.util.Log;

import androidx.annotation.RequiresApi;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

@RequiresApi(api = Build.VERSION_CODES.KITKAT)
public class PdfDocumentAdapter extends PrintDocumentAdapter {

    Context context;
    String appointmentId;

    public PdfDocumentAdapter(Context context, String appointmentId) {
        this.context=context;
        this.appointmentId=appointmentId;
    }

    @Override
    public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes, CancellationSignal cancellationSignal, LayoutResultCallback callback, Bundle extras) {

        if (cancellationSignal.isCanceled()){
            callback.onLayoutCancelled();
        }
        else {
            String fileName=appointmentId+".pdf";
            PrintDocumentInfo.Builder builder= new PrintDocumentInfo.Builder(fileName);
            builder.setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                    .setPageCount(PrintDocumentInfo.PAGE_COUNT_UNKNOWN)
                    .build();

            callback.onLayoutFinished(builder.build(),!newAttributes.equals(newAttributes));
        }
    }

    @Override
    public void onWrite(PageRange[] pages, ParcelFileDescriptor destination, CancellationSignal cancellationSignal, WriteResultCallback callback) {

        InputStream in = null;
        OutputStream out = null;

        try{
            String fileName="/"+appointmentId+".pdf";
            File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)+ fileName);

            in= new FileInputStream(file);

            out= new FileOutputStream(destination.getFileDescriptor());

            byte[] buff= new byte[16384];

            int size;
            while ((size = in.read(buff)) >= 0 && !cancellationSignal.isCanceled()){
                out.write(buff,0,size);

            }
            if (cancellationSignal.isCanceled())
                callback.onWriteCancelled();
            else {
                callback.onWriteFinished(new PageRange[]{
                        PageRange.ALL_PAGES
                });
            }

            } catch (Exception e) {
            callback.onWriteFailed(e.getMessage());
            Log.e("nuvocliniq",e.getMessage());
            e.printStackTrace();
        }finally {
            try {
                in.close();
                out.close();
            } catch (IOException e) {
                Log.e("nuvocliniq",e.getMessage());
                e.printStackTrace();
            }

        }


    }
}
