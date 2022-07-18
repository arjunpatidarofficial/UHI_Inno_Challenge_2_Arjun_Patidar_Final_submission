package in.healthtalk.patientTest.Appointment;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.squareup.picasso.Callback;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;

import de.hdodenhof.circleimageview.CircleImageView;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.R;
import in.healthtalk.patientTest.ViewPdfActivity;

public class AppointmentViewActivity extends AppCompatActivity {

    FirebaseFirestore firebaseFirestore=FirebaseFirestore.getInstance();
    DocumentReference doctorRef,appointmentRef;
    String appointId,patientId, doctorId;
    String docName;
    String date;
    Boolean isPrimary;
    String primaryAppointmentId;
    String slot;

    TextView txtName,txtNumber,txtFee,txtDate,txtSot,txtStatus,txtType;
    CircleImageView img;
    ImageView close;
    LinearLayout viewPres;
    TextView payment;
    Timestamp presCreateAt;
    Button paymentDetails;
    Button linkAnAppointment;


    String paymentId,paymentType;
    // patient Information
    String amount,email,number;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_appointment_view);

        appointId=getIntent().getStringExtra("id");

      //  doctorRef=firebaseFirestore.collection("doctors").document(doctorId);
        appointmentRef=firebaseFirestore.collection("appointment").document(appointId);

        txtName = findViewById(R.id.name);
        img = findViewById(R.id.img);
        txtNumber = findViewById(R.id.number);
        txtFee = findViewById(R.id.fee);
        txtDate = findViewById(R.id.date);
        txtSot = findViewById(R.id.slot);
        txtStatus =findViewById(R.id.status);
        txtType=findViewById(R.id.type);
        linkAnAppointment=findViewById(R.id.linkAnAppointment);


        close=findViewById(R.id.close);
        payment=findViewById(R.id.payment);
        viewPres=findViewById(R.id.viewPres);
        paymentDetails=findViewById(R.id.paymentDetails);

        close=findViewById(R.id.close);

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        linkAnAppointment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(AppointmentViewActivity.this, DoctorListTeleActivity.class);
                intent.putExtra("appointId",appointId);
                intent.putExtra("doctorId",doctorId);
                intent.putExtra("docName",docName);
                intent.putExtra("date",date);
                intent.putExtra("slot",slot);
                intent.putExtra("type","secondary");

                startActivity(intent);
                Toast.makeText(AppointmentViewActivity.this, "Link an Appointment", Toast.LENGTH_SHORT).show();
            }
        });

        viewPres.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(AppointmentViewActivity.this, ViewPdfActivity.class);
                intent.putExtra("appointId",appointId);
                startActivity(intent);
            }
        });

        paymentDetails.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isPrimary){
                    Intent intent = new Intent(AppointmentViewActivity.this,AppointmentPaymentActivity.class);
                    intent.putExtra("amount",amount);
                    intent.putExtra("number",number);
                    intent.putExtra("email",email);
                    intent.putExtra("appointId",appointId);
                    intent.putExtra("patientId",patientId);

                    if (paymentId != null){
                        intent.putExtra("paymentId",paymentId);
                        intent.putExtra("paymentType",paymentType);
                    }
                    startActivity(intent);
                }
            }
        });

        getCurrentUserInfomation();

        appointmentRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirebaseFirestoreException error) {
//                String docImg=value.get("img").toString();
//                String docName=value.get("name").toString();
//                String specialist=value.get("specialist").toString();

                if (value.get("name") != null){
                    String name=value.get("name").toString();
                }

                isPrimary = (Boolean) value.get("isPrimary");

                if((Boolean) value.get("isPrimary")){

                }else{
                    primaryAppointmentId = value.get("primaryAppointmentId").toString();
                    linkAnAppointment.setVisibility(View.GONE);
                }

                if (value.get("patientId")!=null){
                    patientId=value.get("patientId").toString();
                }

                doctorId=value.get("doctorId").toString();
                String status=value.get("status").toString();
                String type=value.get("type").toString();
                 date=value.get("date").toString();
                 slot=value.get("slot").toString();




                if (value.get("fee").toString() !=null){
                    amount=value.get("fee").toString();
                    String fee=value.get("fee").toString();
                    txtFee.setText("₹"+fee);

                }
                String fee=value.get("fee").toString();
                String paymentStatus=value.get("paymentStatus").toString();
                String paymentString=value.get("payment").toString();

                if (value.getTimestamp("presCreateAt") !=null){
                    viewPres.setVisibility(View.VISIBLE);
                  presCreateAt=value.getTimestamp("presCreateAt");
                }


                txtDate.setText(date);
                txtSot.setText(slot);
                txtStatus.setText(status);
                txtType.setText(type);

                if (status.equals("Scheduled")){
                    txtStatus.setText("Scheduled");
                    txtType.setText("Start Consultation");
                    txtStatus.setBackground(getResources().getDrawable(R.drawable.btnyellow));
                }

                if (paymentStatus.equals("true")) {
                    payment.setText("Payment already done");
                    payment.setTextColor(getResources().getColor(R.color.green));
                    if (value.get("paymentId") !=null){
                        paymentId=value.get("paymentId").toString();
                    }
                    if (value.get("paymentType") != null){
                        paymentType=value.get("paymentType").toString();
                    }
                }
                else {
                    payment.setText("Payment not done");
                    payment.setTextColor(getResources().getColor(R.color.red));
                }

                txtType.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (type.equals("Telemedicine")){
                            if (status.equals("Scheduled")){
                                Intent intent=new Intent(AppointmentViewActivity.this, TelemadicineActivity.class);
                                intent.putExtra("doctorId",doctorId);
                                if(isPrimary){
                                    intent.putExtra("id",appointId);

                                }else{
                                    intent.putExtra("id",primaryAppointmentId);
                                }
                                intent.putExtra("doctorName",docName);
                                startActivity(intent);
                            }
                        }
                    }
                });

                doctorRef=firebaseFirestore.collection(Common.doctor_ref).document(doctorId);

                doctorRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
                    @Override
                    public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirebaseFirestoreException error) {
                        String docImg=value.get("img").toString();
                         docName=value.get("name").toString();
                        String specialist=value.get("specialist").toString();

                       txtName.setText(docName);
                       txtNumber.setText(specialist);

                        Picasso.get().load(docImg).placeholder(R.drawable.profile_image).networkPolicy(NetworkPolicy.OFFLINE).into(img, new Callback() {
                            @Override
                            public void onSuccess() {
                            }

                            @Override
                            public void onError(Exception e) {
                                Picasso.get().load(docImg).placeholder(R.drawable.profile_image).into(img);
                            }
                        });

                    }
                });

            }
        });



    }

   public void getCurrentUserInfomation(){
     DocumentReference  patientRef=firebaseFirestore.collection(Common.patient_ref).document(FirebaseAuth.getInstance().getCurrentUser().getUid());

       patientRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
           @Override
           public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirebaseFirestoreException error) {
               if (value.get("number").toString() !=null){
                   number=value.get("number").toString();
               }

               if (value.get("email").toString() !=null){
                   email=value.get("email").toString();

               }


           }
       });
    }

}