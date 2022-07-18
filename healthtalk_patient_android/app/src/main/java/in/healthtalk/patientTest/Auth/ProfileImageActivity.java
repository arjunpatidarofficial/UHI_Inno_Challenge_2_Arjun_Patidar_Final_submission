package in.healthtalk.patientTest.Auth;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.OnProgressListener;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import com.squareup.picasso.Callback;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;
import com.theartofdev.edmodo.cropper.CropImage;
import com.theartofdev.edmodo.cropper.CropImageView;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import id.zelory.compressor.Compressor;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.R;

public class ProfileImageActivity extends AppCompatActivity {

    String img_string;

    ImageView profileimg, back, edit;

    private Uri imageUri, cropImageUri;

    private static final int PICK_IMAGE = 1;

    LinearLayout layout;

    ProgressDialog progressDialog;

    DocumentReference currentUserRef;
    private StorageReference mStorage;

    Button btnChange, btnCancel;
    TextView title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_image);

        img_string = getIntent().getStringExtra("img_string");
        title = findViewById(R.id.title);
        imageUri = null;
        profileimg = findViewById(R.id.profileimg);
        back = findViewById(R.id.back);
        edit = findViewById(R.id.edit);
        layout = findViewById(R.id.layout);
        btnChange = findViewById(R.id.btnChange);
        btnCancel = findViewById(R.id.btnCancel);

        mStorage = FirebaseStorage.getInstance().getReference().child("image");
        currentUserRef= FirebaseFirestore.getInstance()
                .collection(Common.patient_ref)
                .document(FirebaseAuth.getInstance().getCurrentUser().getUid());


        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.setType("image/*");
                intent.setAction(Intent.ACTION_GET_CONTENT);
                startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE);
            }
        });

        Picasso.get().load(img_string).placeholder(R.drawable.profile_image
        ).networkPolicy(NetworkPolicy.OFFLINE).into(profileimg, new Callback() {
            @Override
            public void onSuccess() {

            }

            @Override
            public void onError(Exception e) {
                Picasso.get().load(img_string).placeholder(R.drawable.profile_image).into(profileimg);
            }
        });


        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                layout.setVisibility(View.GONE);
                Picasso.get().load(img_string).placeholder(R.drawable.profile_image).networkPolicy(NetworkPolicy.OFFLINE).into(profileimg, new Callback() {
                    @Override
                    public void onSuccess() {

                    }

                    @Override
                    public void onError(Exception e) {
                        Picasso.get().load(img_string).placeholder(R.drawable.profile_image).into(profileimg);
                    }
                });
            }
        });

        btnChange.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                userImageUpload(FirebaseAuth.getInstance().getCurrentUser().getUid());
            }
        });
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (data != null) {
            if (requestCode == PICK_IMAGE && resultCode == RESULT_OK) {
                imageUri = data.getData();
                CropImage.activity(imageUri).setGuidelines(CropImageView.Guidelines.ON)
                        .setAspectRatio(1, 1)
                        .start(ProfileImageActivity.this);

            }
            if (requestCode == CropImage.CROP_IMAGE_ACTIVITY_REQUEST_CODE) {
                CropImage.ActivityResult result = CropImage.getActivityResult(data);
                if (resultCode == RESULT_OK) {
                    cropImageUri = result.getUri();
                    profileimg.setImageURI(cropImageUri);
                    layout.setVisibility(View.VISIBLE);
                } else if (requestCode == CropImage.CROP_IMAGE_ACTIVITY_RESULT_ERROR_CODE) {
                    Toast.makeText(this, "Image not croped", Toast.LENGTH_SHORT).show();

                }
            }
        }

    }

    private void userImageUpload(final String user_id) {
        if (cropImageUri != null) {

            File actualImage = new File(cropImageUri.getPath());

            progressDialog = new ProgressDialog(this);
            progressDialog.setTitle("Profile Image Uploading...");
            progressDialog.show();

            try {
                Bitmap compressedImage = new Compressor(this)
                        .setMaxWidth(200)
                        .setMaxHeight(200)
                        .setQuality(75)
                        .compressToBitmap(actualImage);

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                compressedImage.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                byte[] final_image = baos.toByteArray();

                final StorageReference ref = mStorage.child(user_id + ".jpg");

                UploadTask uploadTask = ref.putBytes(final_image);

                uploadTask.addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                    @Override
                    public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                        ref.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                            @Override
                            public void onSuccess(final Uri uri) {

                                Uri uriImage = uri;

                                final Map<String, Object> updateInfo = new HashMap<>();
                                updateInfo.put("img", uriImage.toString());

                                currentUserRef.update(updateInfo)
                                        .addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {
                                                if (task.isSuccessful()) {
                                                    layout.setVisibility(View.GONE);
                                                    progressDialog.dismiss();
                                                    Toast.makeText(ProfileImageActivity.this, "Profile Image Successfully Change!", Toast.LENGTH_SHORT).show();
                                                } else {
                                                    progressDialog.dismiss();
                                                    Toast.makeText(ProfileImageActivity.this, "Uploaded error!", Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                            }
                        });
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        dismissProgressDialog();
                        Toast.makeText(ProfileImageActivity.this, "Failed " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }).addOnProgressListener(new OnProgressListener<UploadTask.TaskSnapshot>() {
                    @Override
                    public void onProgress(UploadTask.TaskSnapshot taskSnapshot) {
                        double progress = (100.0 * taskSnapshot.getBytesTransferred() / taskSnapshot
                                .getTotalByteCount());
                        progressDialog.setMessage("Uploaded " + (int) progress + "%");
                    }
                });

            } catch (IOException e) {
                e.printStackTrace();
            }


        }

    }

    @Override
    protected void onDestroy() {
        dismissProgressDialog();
        super.onDestroy();
    }

    private void dismissProgressDialog() {
        if (progressDialog != null && progressDialog.isShowing()) {
            progressDialog.dismiss();
        }
    }

}