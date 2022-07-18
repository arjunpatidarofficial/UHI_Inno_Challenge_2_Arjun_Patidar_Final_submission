package in.healthtalk.patientTest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.WriteBatch;

import java.util.HashMap;
import java.util.Map;

import in.healthtalk.patientTest.Common.Common;

public class AppoinmentSubActivity extends AppCompatActivity {

    TextView name,number,date,slot ,appointType;
    FirebaseFirestore database=FirebaseFirestore.getInstance();

    TextView totalAmount;
    String fee ,doctorId ,docName;

    DocumentReference userRef, appointmentRef ,transRef , oldAppointmentRef;

    Button btnOnline;
    ImageView close;

    @SuppressLint("WrongViewCast")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_appoinment_sub);

        userRef=database.collection("patients").document(FirebaseAuth.getInstance().getCurrentUser().getUid());
        appointmentRef=database.collection("appointment").document();
        oldAppointmentRef=database.collection("appointment").document((String) Common.oldAppointmentInfo.get("appointId"));
        transRef=database.collection(Common.transaction_ref).document();

        fee = getIntent().getStringExtra("fee");

        btnOnline=findViewById(R.id.btnOnline);
        close=findViewById(R.id.close);
        doctorId=getIntent().getStringExtra("doctorId");
        docName=getIntent().getStringExtra("docName");

        name=findViewById(R.id.name);
        number=findViewById(R.id.number);
        date=findViewById(R.id.date);
        slot=findViewById(R.id.slot);
        totalAmount=findViewById(R.id.total);
        appointType=findViewById(R.id.appointType);


        getDate(userRef);

        date.setText((String) Common.oldAppointmentInfo.get("date"));
        slot.setText((String) Common.oldAppointmentInfo.get("slot"));
        totalAmount.setText(fee);
        appointType.setText("Telemedicine");

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        btnOnline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                final Map<String, Object> updateInfo = new HashMap<>();
                updateInfo.put("name", name.getText().toString());
                updateInfo.put("number", number.getText().toString());
                updateInfo.put("date",date.getText().toString());
                updateInfo.put("appointInt","568554543434333223");
                updateInfo.put("slot",slot.getText().toString() );
                updateInfo.put("doctorId", doctorId);
                updateInfo.put("viewtype", 0);
                updateInfo.put("primaryAppointmentId" , Common.oldAppointmentInfo.get("appointId"));
                updateInfo.put("primaryDocName" , Common.oldAppointmentInfo.get("docName"));
                updateInfo.put("primaryDocId" , Common.oldAppointmentInfo.get("doctorId"));


                updateInfo.put("status", "Scheduled");
                updateInfo.put("patientId",FirebaseAuth.getInstance().getCurrentUser().getUid());
                updateInfo.put("type","Telemedicine");
                updateInfo.put("clinicName","none");
                updateInfo.put("payment","Prepaid");
                updateInfo.put("fee",fee);
                updateInfo.put("transId","rzr_euewwiewiewe1222322");
                updateInfo.put("paymentType","Online");
                updateInfo.put("paymentStatus" ,"false");
                updateInfo.put("isPrimary",false);
                updateInfo.put("paymentId",transRef.getId());
//                updateInfo.put("slotId",slotId);
                updateInfo.put("createAt", Timestamp.now());

                final Map<String, Object> oldAppointInfo = new HashMap<>();
                oldAppointInfo.put("subAppointId",appointmentRef.getId());
                oldAppointInfo.put("subDocId" ,doctorId);
//                updateInfo.put("isPrimary",true);
                oldAppointInfo.put("subDocName" ,docName);

                final Map<String, Object> paymentInfo = new HashMap<>();
                paymentInfo.put("transId","trans-2323433");
                paymentInfo.put("amount",fee);
                paymentInfo.put("status","true");
                paymentInfo.put("type","Online");
                paymentInfo.put("appointId",appointmentRef.getId());
                paymentInfo.put("number",updateInfo.get("number"));
                paymentInfo.put("userId",updateInfo.get("patientId"));
                paymentInfo.put("createAt", Timestamp.now());



//                appointmentRef.set(updateInfo).addOnCompleteListener(new OnCompleteListener<Void>() {
//                    @Override
//                    public void onComplete(@NonNull Task<Void> task) {
//                        Toast.makeText(AppoinmentSubActivity.this, "Success", Toast.LENGTH_SHORT).show();
//
//                    }
//                }).addOnFailureListener(new OnFailureListener() {
//                    @Override
//                    public void onFailure(@NonNull Exception e) {
//                        Toast.makeText(AppoinmentSubActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
//                    }
//                });

                WriteBatch batch = Common.dbFireStore.batch();
                batch.set(appointmentRef, updateInfo);
                batch.update(oldAppointmentRef,oldAppointInfo);
                batch.set(transRef,paymentInfo);

                batch.commit().addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        Toast.makeText(AppoinmentSubActivity.this, "Appointment Confirm", Toast.LENGTH_LONG).show();
                        Intent intent =new Intent(AppoinmentSubActivity.this, MainActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                    }
                });

            }
        });

    }


    public void getDate(DocumentReference userRef){

        userRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot snapshot, @Nullable FirebaseFirestoreException error) {
                if (snapshot.get("name") !=null) name.setText(snapshot.get("name").toString());
                //   if (snapshot.get("email") ==null) email.setText(snapshot.get("email").toString());
                if (snapshot.get("number") !=null) number.setText(snapshot.get("number").toString());
//                if (snapshot.get("email") !=null) email=snapshot.get("email").toString();
            }
        });

    }

}