package in.healthtalk.patientTest.Auth;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.WriteBatch;

import java.util.HashMap;
import java.util.Map;

import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.MainActivity;
import in.healthtalk.patientTest.R;

public class UpdateProfileActivity extends AppCompatActivity {

    EditText name,email,address,height,weight,aadhar,age;
    Spinner gender;
    Button btnUpdate,btnCancel;
    boolean isName=false,isEmail=false,isAddress=false,isHeight=false,isWeight=false,isAdhar=false,isAge=false;
    FirebaseFirestore database=FirebaseFirestore.getInstance();
    DocumentReference userRef;
    ArrayAdapter<CharSequence> genderAdapter;
    ImageView close;
    ProgressBar progressbar;
    String type="update";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_profile);

        type=getIntent().getStringExtra("type");

        userRef=database.collection("patients").document(Common.mAuth.getCurrentUser().getUid());

        name=findViewById(R.id.name);
        email=findViewById(R.id.email);
        address=findViewById(R.id.address);
        height=findViewById(R.id.height);
        weight=findViewById(R.id.weight);
        aadhar=findViewById(R.id.aadhar);
        age=findViewById(R.id.age);
        gender =findViewById(R.id.gender);
        btnUpdate=findViewById(R.id.update);
        btnCancel=findViewById(R.id.cancel);
        close=findViewById(R.id.close);
        progressbar=findViewById(R.id.progressbar);

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        genderAdapter = ArrayAdapter.createFromResource(UpdateProfileActivity.this,
                R.array.gender, R.layout.spinner_item);
        genderAdapter.setDropDownViewResource(R.layout.spinner_dropdown_item);
        gender.setAdapter(genderAdapter);

        btnUpdate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressbar.setVisibility(View.VISIBLE);
                if (TextUtils.isEmpty(name.getText().toString())){
                    name.setError("Please fill out this field");
                    name.requestFocus();
                    isName=false;
                }else {
                    isName=true;
                }

                if (TextUtils.isEmpty(email.getText().toString())){
                    isEmail=true;
                }else if(!Patterns.EMAIL_ADDRESS.matcher(email.getText().toString()).matches()){
                    email.setError("Please enter a valid email address");
                    isEmail=false;
                }else{
                    isEmail=true;
                }

                if (TextUtils.isEmpty(address.getText().toString())){
                    isAddress=true;
                }else{
                    isAddress=true;
                }

                if (TextUtils.isEmpty(height.getText().toString())){
                    isHeight=true;
                }else if(height.getText().toString().length() <= 3){
                    isHeight=true;
                }else{
                    height.setError("Please fill valid height");
                    isHeight=false;
                }

                if (TextUtils.isEmpty(weight.getText().toString())){
                    isWeight=true;
                }else if(weight.getText().toString().length() <= 3){
                    isWeight=true;
                }
                else{
                    weight.setError("Please fill valid weight");
                    isWeight=true;
                }

                if (TextUtils.isEmpty(aadhar.getText().toString())){
                    isAdhar=true;
                }else if(aadhar.getText().toString().length() != 12){
                    aadhar.setError("Please enter a valid Aadhar Number");
                    isAdhar=false;
                }else{
                    isAdhar=true;
                }

                if (TextUtils.isEmpty(age.getText().toString())){
                    isAge=true;
                }else if(age.getText().toString().length() <= 3){
                    isAge=true;
                }else{
                    age.setError("Please fill valid age");
                    isAge=false;
                }

                final Map<String, Object> updateInfo = new HashMap<>();
                updateInfo.put("name", name.getText().toString());
                if (!email.getText().toString().equals(""))
                updateInfo.put("email", email.getText().toString());
                if (!address.getText().toString().equals(""))
                 updateInfo.put("address", address.getText().toString());
                if (!height.getText().toString().equals(""))
                updateInfo.put("height", height.getText().toString());
                if (!weight.getText().toString().equals(""))
                updateInfo.put("weight", weight.getText().toString());
                if (!age.getText().toString().equals(""))
                updateInfo.put("age", age.getText().toString());
                if (!aadhar.getText().toString().equals(""))
                updateInfo.put("aadhar", aadhar.getText().toString());

                updateInfo.put("gender", gender.getSelectedItem().toString());

                if (isName && isEmail && isAddress && isHeight && isWeight && isAge && isAdhar){

                    WriteBatch batch = Common.dbFireStore.batch();
                    batch.update(userRef, updateInfo);

                    userRef.update(updateInfo).addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            if (type.equals("update")){
//                                Toast.makeText(UpdateProfileActivity.this, "update", Toast.LENGTH_SHORT).show();
                                Toast.makeText(UpdateProfileActivity.this, "successfully update", Toast.LENGTH_SHORT).show();
                                finish();
                            }else{

                                Toast.makeText(UpdateProfileActivity.this, "successfully update", Toast.LENGTH_SHORT).show();Intent intent=new Intent(UpdateProfileActivity.this,MainActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                startActivity(intent);
                                finish();
                            }

                        }
                    }).addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Toast.makeText(UpdateProfileActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    });

//                    userRef.update(updateInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
//                        @Override
//                        public void onSuccess(Void aVoid) {
//                            progressbar.setVisibility(View.GONE);
//                            if (type.equals("update")){
//                                Toast.makeText(UpdateProfileActivity.this, "successfully update", Toast.LENGTH_SHORT).show();
//                                finish();
//                            }else if(type.equals("login")) {
//                                Toast.makeText(UpdateProfileActivity.this, "successfully update", Toast.LENGTH_SHORT).show();
//                                Intent intent=new Intent(UpdateProfileActivity.this,MainActivity.class);
//                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
//                                startActivity(intent);
//                                finish();
//                            }
//                            }
//
//                    }).addOnFailureListener(new OnFailureListener() {
//                        @Override
//                        public void onFailure(@NonNull Exception e) {
//                            progressbar.setVisibility(View.GONE);
//                            Toast.makeText(UpdateProfileActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
//
//                        }
//                    });
                }else {
                    progressbar.setVisibility(View.GONE);
                }

            }
        });


        getUserData(userRef);

    }

    public void getUserData(DocumentReference userRef){

        userRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot snapshot, @Nullable FirebaseFirestoreException error) {

                    if (snapshot.get("name") !=null) name.setText(snapshot.get("name").toString());
                    if (snapshot.get("email") !=null) email.setText(snapshot.get("email").toString());
                    if (snapshot.get("age") !=null) age.setText(snapshot.get("age").toString());
                    if (snapshot.get("height") !=null) height.setText(snapshot.get("height").toString());
                    if (snapshot.get("weight") !=null) weight.setText(snapshot.get("weight").toString());
                    if (snapshot.get("address") !=null) address.setText(snapshot.get("address").toString());
                    if (snapshot.get("aadhar") !=null) aadhar.setText(snapshot.get("aadhar").toString());

                    if (snapshot.get("gender") !=null) {
                        String compareValue = snapshot.get("gender").toString();

                        if (compareValue != null) {
                            int spinnerPosition = genderAdapter.getPosition(compareValue);
                            gender.setSelection(spinnerPosition);
                        }

                    }

            }
        });

    }


}