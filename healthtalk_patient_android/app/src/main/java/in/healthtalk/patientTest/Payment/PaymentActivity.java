package in.healthtalk.patientTest.Payment;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.WriteBatch;
import com.razorpay.Checkout;
import com.razorpay.PaymentResultListener;
import org.json.JSONObject;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.MainActivity;
import in.healthtalk.patientTest.R;

public class PaymentActivity extends AppCompatActivity implements PaymentResultListener {

    FirebaseFirestore database=FirebaseFirestore.getInstance();
    DocumentReference appointmentRef,transRef;
    Map<String, Object> updateInfo;
    LinearLayout progressLayout,responceLayout,cancelLayout;
    ImageView paymnetImg;

    DocumentReference slotRef,notificationRef;

    TextView transictionId,total,decs,paymentStatus;
    Button btnNext,back;
    boolean isPayment=false;
    TextView payableAmount;
    String dayInt,slotId;

    private String TAG =" main";

    String amount,firstname,phone,email;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment);

        Intent intent = getIntent();
        updateInfo = (Map<String, Object>)intent.getSerializableExtra("map");

        amount=updateInfo.get("fee").toString();
        dayInt=getIntent().getStringExtra("dayInt");
        slotId=getIntent().getStringExtra("slotId");

        notificationRef= Common.dbFireStore.collection("notifications").document();

        //  Toast.makeText(this, updateInfo.get("name").toString(), Toast.LENGTH_SHORT).show();
        firstname =updateInfo.get("name").toString();
        phone=updateInfo.get("number").toString();
        email =updateInfo.get("email").toString();

        appointmentRef=database.collection(Common.appointment_ref).document();
        transRef=database.collection(Common.transaction_ref).document();

        slotRef = Common.dbFireStore.collection(Common.doctor_ref)
                .document(updateInfo.get("doctorId").toString())
                .collection(Common.calendar_dates_ref).document(dayInt)
                .collection(Common.calendar_slots_ref)
                .document(slotId);

        progressLayout=findViewById(R.id.progressLayout);
        transictionId=findViewById(R.id.transictionId);
        total=findViewById(R.id.transictionId);
        responceLayout=findViewById(R.id.responceLayout);
        decs=findViewById(R.id.decs);
        btnNext=findViewById(R.id.btnNext);
        paymentStatus=findViewById(R.id.paymentStatus);
        paymnetImg=findViewById(R.id.paymnetImg);
        cancelLayout=findViewById(R.id.cancelLayout);
        back=findViewById(R.id.back);
        payableAmount=findViewById(R.id.total);

        payableAmount.setText("₹"+amount);

        btnNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isPayment){
                    Intent intent= new Intent(PaymentActivity.this, MainActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                }else {
                    finish();
                }
            }
        });

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        startPayment();


    }

    public void startPayment() {
        /**
         * You need to pass current activity in order to let Razorpay create CheckoutActivity
         */
        final Activity activity = this;
        final Checkout co = new Checkout();
        try {
            JSONObject options = new JSONObject();
            options.put("name", "HealthTalk");
            options.put("description", "Appointment payment");
            //You can omit the image option to fetch the image from dashboard
            options.put("currency", "INR");
            // amount is in paise so please multiple it by 100
            //Payment failed Invalid amount (should be passed in integer paise. Minimum value is 100 paise, i.e. ₹ 1)
            double total = Double.parseDouble(amount);
            total = total * 100;
            options.put("amount", total);
            JSONObject preFill = new JSONObject();
            preFill.put("email",email);
            preFill.put("name",firstname);
            preFill.put("contact", phone);
            options.put("prefill", preFill);
            co.open(activity, options);
        } catch (Exception e) {
            Toast.makeText(activity, "Error in payment: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
    }

    @Override
    public void onPaymentSuccess(String transactionId) {
        isPayment=true;
        progressLayout.setVisibility(View.GONE);
        responceLayout.setVisibility(View.VISIBLE);
        transictionId.setText(transactionId);
        paymentStatus.setText("Payment Sussessfully");
        decs.setText("Your payment of"+" ₹"+amount+" was successfully complete");
        paymnetImg.setImageDrawable(getResources().getDrawable(R.drawable.checked));

        final Map<String, Object> paymentInfo = new HashMap<>();
        paymentInfo.put("transId",transactionId);
        paymentInfo.put("amount",amount);
        paymentInfo.put("status","true");
        paymentInfo.put("type","Online");
        paymentInfo.put("appointId",appointmentRef.getId());
        paymentInfo.put("number",updateInfo.get("number"));
        paymentInfo.put("userId",updateInfo.get("patientId"));
        paymentInfo.put("createAt", Timestamp.now());

        updateInfo.put("transId",transactionId);
        updateInfo.put("createAt",Timestamp.now());
        updateInfo.put("type",updateInfo.get("type"));
        updateInfo.put("payment","Prepaid");
        updateInfo.put("clinicId",Common.appointmentInfo.get("clinicId"));
        updateInfo.put("paymentType","Online");
        updateInfo.put("paymentStatus" ,"true");
        updateInfo.put("isPrimary",true);
        updateInfo.put("paymentId",transRef.getId());

        setTransaction(transRef,paymentInfo);
        setAppointmentInfo(appointmentRef,updateInfo);
    }

    @Override
    public void onPaymentError(int i, String decs) {
        try {

            progressLayout.setVisibility(View.GONE);
            cancelLayout.setVisibility(View.VISIBLE);
            Toast.makeText(this,decs, Toast.LENGTH_SHORT).show();

        } catch (Exception e) {

            Toast.makeText(this, e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    public void setTransaction(DocumentReference transRef, Map<String, Object> paymentInfo){
        transRef.set(paymentInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {

            }
        });
    }


    public void setAppointmentInfo(DocumentReference appointmentRef, Map<String, Object> updateInfo){

        final Map<String, Object> slotInfo = new HashMap<>();
        slotInfo.put("status","booked");
        slotInfo.put("appointId",appointmentRef.getId());
        slotInfo.put("type", Arrays.asList(updateInfo.get("type")));

        String content="Payment of Rs"+amount+" received";
        final Map<String, Object> notificationInfoDoctor = new HashMap<>();
        notificationInfoDoctor.put("title","Payment successfully received");
        notificationInfoDoctor.put("content", content);
        notificationInfoDoctor.put("appointId",appointmentRef.getId());
        notificationInfoDoctor.put("type","appointPayment");
        notificationInfoDoctor.put("doctorId", updateInfo.get("doctorId"));

        final Map<String, Object> notificationInfoPatient = new HashMap<>();
        notificationInfoPatient.put("title","Payment successfully done");
        notificationInfoPatient.put("content", content);
        notificationInfoPatient.put("appointId",appointmentRef.getId());
        notificationInfoPatient.put("type","appointPayment");
        notificationInfoPatient.put("patientId",Common.mAuth.getCurrentUser().getUid());

        WriteBatch batch = Common.dbFireStore.batch();
        batch.set(appointmentRef, updateInfo);
        batch.update(slotRef, slotInfo);
        batch.set(notificationRef,notificationInfoDoctor);
        batch.set(notificationRef,notificationInfoPatient);
        batch.commit().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                Toast.makeText(PaymentActivity.this, "Appointment Confirm", Toast.LENGTH_LONG).show();
            }
        });

//        appointmentRef.set(updateInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
//            @Override
//            public void onSuccess(Void aVoid) {
//
//                slotRef.child(updateInfo.get("slotId").toString()).updateChildren(slotInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
//                    @Override
//                    public void onSuccess(Void aVoid) {
//
//
//                        notificationRef.set(notificationInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
//                            @Override
//                            public void onSuccess(Void aVoid) {
//                                Toast.makeText(PaymentActivity.this, "Appointment Confirm", Toast.LENGTH_LONG).show();
//                            }
//                        }).addOnFailureListener(new OnFailureListener() {
//                            @Override
//                            public void onFailure(@NonNull Exception e) {
//
//                            }
//                        });
//
//
//                        Toast.makeText(PaymentActivity.this, "Appointment Confirm", Toast.LENGTH_LONG).show();
//                    }
//                });
//            }
//        });
    }




}