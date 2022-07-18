package in.healthtalk.patientTest.Appointment;

import androidx.appcompat.app.AppCompatActivity;

import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.R;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.WriteBatch;
import com.razorpay.Checkout;
import com.razorpay.PaymentResultListener;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class AppointmentPaymentActivity extends AppCompatActivity implements PaymentResultListener {

    TextView transId,fee,time;
    String paymentId;
    DocumentReference dbPayment;
    ImageView close;
    LinearLayout paymentDoneLayout,notPayLayout,cancelLayout,paymentDoneCashLayout;
    TextView payableAmount;
    Button btnOnline,retry;
    String amount,number,email,appointId,patientId;
    FirebaseFirestore database=FirebaseFirestore.getInstance();

    DocumentReference appointmentRef,transRef;

    // cash payment
    TextView cashTime,cashFee;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_appointment_payment);

        transId=findViewById(R.id.transId);
        fee=findViewById(R.id.fee);
        time=findViewById(R.id.time);
        close=findViewById(R.id.close);
        paymentDoneLayout=findViewById(R.id.paymentDoneLayout);
        notPayLayout=findViewById(R.id.notPayLayout);
        payableAmount=findViewById(R.id.payableAmount);
        cancelLayout=findViewById(R.id.cancelLayout);
        btnOnline=findViewById(R.id.btnOnline);
        retry=findViewById(R.id.retry);

        // cash payment

        cashTime=findViewById(R.id.cashTime);
        cashFee=findViewById(R.id.cashFee);
        paymentDoneCashLayout=findViewById(R.id.paymentDoneCashLayout);

        retry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startPayment();
            }
        });

        btnOnline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startPayment();
            }
        });

        appointId=getIntent().getStringExtra("appointId");
        patientId=getIntent().getStringExtra("patientId");
        appointmentRef=database.collection(Common.appointment_ref).document(appointId);


        if (getIntent().getStringExtra("paymentId") !=null){
            String paymentType=getIntent().getStringExtra("paymentType");
            if (paymentType.equals("Online")){
                paymentDoneLayout.setVisibility(View.VISIBLE);
                paymentId=getIntent().getStringExtra("paymentId");
                getPaymentInformation(paymentId);
            }else if(paymentType.equals("Cash")){
                paymentDoneCashLayout.setVisibility(View.VISIBLE);
                paymentId=getIntent().getStringExtra("paymentId");
                getCashPaymentInformation(paymentId);
            }

        }else {
            amount=getIntent().getStringExtra("amount");
            number=getIntent().getStringExtra("number");
            email=getIntent().getStringExtra("email");

            payableAmount.setText("₹"+amount);
            notPayLayout.setVisibility(View.VISIBLE);
            transRef=database.collection(Common.transaction_ref).document();
        }

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

    }

    public void getPaymentInformation(String paymentId){
        Common.dbFireStore.collection(Common.payment_ref).document(paymentId).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot snapshot) {
                if (snapshot.get("transId") !=null){
                    transId.setText(snapshot.get("transId").toString());
                }

                if (snapshot.get("amount") !=null){
                    fee.setText("₹"+snapshot.get("amount").toString());
                }

                if (snapshot.getTimestamp("createAt") !=null){
                    Timestamp timestamp=snapshot.getTimestamp("createAt");
                    String first,second,finalstring;
                    first=timestamp.toDate().toString().substring(0,16);
                    second=timestamp.toDate().toString().substring(30,34);
                    time.setText(first + " " + second);
                }
            }
        });
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
            preFill.put("contact", number);
            options.put("prefill", preFill);
            co.open(activity, options);
        } catch (Exception e) {
            Toast.makeText(activity, "Error in payment: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
    }


    @Override
    public void onPaymentSuccess(String transactionId) {

        final Map<String, Object> paymentInfo = new HashMap<>();
        paymentInfo.put("transId",transactionId);
        paymentInfo.put("amount",amount);
        paymentInfo.put("status","true");
        paymentInfo.put("appointId",appointId);
        paymentInfo.put("number",number);
        paymentInfo.put("userId",patientId);
        paymentInfo.put("type","Online");
        paymentInfo.put("createAt", Timestamp.now());

        final Map<String, Object> updateInfo = new HashMap<>();
        updateInfo.put("paymentStatus","true");
        updateInfo.put("transId",transactionId);
        updateInfo.put("transId",transactionId);
        updateInfo.put("paymentId",transRef.getId());

        setAppointmentInfo(appointmentRef,updateInfo,transRef,paymentInfo);

    }

    @Override
    public void onPaymentError(int i, String s) {
        notPayLayout.setVisibility(View.GONE);
        cancelLayout.setVisibility(View.VISIBLE);
    }



    public void setAppointmentInfo(DocumentReference appointmentRef, Map<String, Object> updateInfo,DocumentReference transRef, Map<String, Object> paymentInfo){

       DocumentReference notificationRef =Common.dbFireStore.collection(Common.notifications_ref).document();

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
        batch.set(transRef,paymentInfo);
        batch.set(notificationRef,notificationInfoDoctor);
        batch.set(notificationRef,notificationInfoPatient);
        batch.commit().addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                paymentDoneLayout.setVisibility(View.VISIBLE);
                cancelLayout.setVisibility(View.GONE);
                notPayLayout.setVisibility(View.GONE);
                getPaymentInformation(transRef.getId());
                Toast.makeText(AppointmentPaymentActivity.this, "Payment successfully done", Toast.LENGTH_SHORT).show();

            }
        });
    }

    public void getCashPaymentInformation(String paymentId){
        Common.dbFireStore.collection(Common.payment_ref).document(paymentId).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot snapshot) {
                if (snapshot.get("amount") !=null){
                    cashFee.setText("₹"+snapshot.get("amount").toString());
                }

                if (snapshot.getTimestamp("createAt") !=null){
                    Timestamp timestamp=snapshot.getTimestamp("createAt");
                    String first,second,finalstring;
                    first=timestamp.toDate().toString().substring(0,16);
                    second=timestamp.toDate().toString().substring(30,34);
                    cashTime.setText(first + " " + second);

                }
            }
        });
    }

}