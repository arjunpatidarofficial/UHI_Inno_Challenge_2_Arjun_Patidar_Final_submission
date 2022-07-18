package in.healthtalk.patientTest.Auth;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;

import java.util.HashMap;
import java.util.Map;

import in.healthtalk.patientTest.R;

public class ProfileViewActivity extends AppCompatActivity {

    TextView name,email,address,height,weight,aadhar,age,gender,edit;

    FirebaseFirestore database=FirebaseFirestore.getInstance();
    DocumentReference userRef;
    ImageView close;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_view);

        name=findViewById(R.id.name);
        email=findViewById(R.id.email);
        address=findViewById(R.id.address);
        height=findViewById(R.id.height);
        weight=findViewById(R.id.weight);
        aadhar=findViewById(R.id.aadhar);
        age=findViewById(R.id.age);
        gender =findViewById(R.id.gender);
        edit=findViewById(R.id.edit);
        close=findViewById(R.id.close);

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent=new Intent(ProfileViewActivity.this, UpdateProfileActivity.class);
                intent.putExtra("type","update");
                startActivity(intent);
            }
        });

        userRef=database.collection("patients").document(FirebaseAuth.getInstance().getCurrentUser().getUid());

        userRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot snapshot, @Nullable FirebaseFirestoreException error) {
                if (snapshot.get("name") ==null){

                }else {
                    if (snapshot.get("name") !=null) name.setText(snapshot.get("name").toString());
                    if (snapshot.get("email") !=null) email.setText(snapshot.get("email").toString());
                    if (snapshot.get("age") !=null) age.setText(snapshot.get("age").toString()+" Years old");
                    if (snapshot.get("height") !=null) height.setText(snapshot.get("height").toString()+" Centimeters");
                    if (snapshot.get("weight") !=null) weight.setText(snapshot.get("weight").toString()+ " Kilograms");
                    if (snapshot.get("address") !=null) address.setText(snapshot.get("address").toString());
                    if (snapshot.get("aadhar") !=null) aadhar.setText(snapshot.get("aadhar").toString());
                    if (snapshot.get("gender") !=null) gender.setText(snapshot.get("gender").toString());

                }
            }
        });

    }

    public void setData(){

        final Map<String, Object> updateInfo = new HashMap<>();
        updateInfo.put("address", address.getText().toString());

        userRef.update(updateInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {

                    Toast.makeText(ProfileViewActivity.this, "successfully update", Toast.LENGTH_SHORT).show();
                    Intent intent=new Intent(ProfileViewActivity.this,UpdateProfileActivity.class);
                    startActivity(intent);
                    finish();
            }

        });
    }
}