package in.healthtalk.patientTest.Appointment;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.WriteBatch;

import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.MainActivity;
import in.healthtalk.patientTest.Payment.PaymentActivity;
import in.healthtalk.patientTest.R;

public class AppoinmentActivity extends AppCompatActivity {

    DocumentReference notificationRef,notificationRef1;

    TextView name,number,date,slot;
    String type;
    TextView appointType;
    FirebaseFirestore database=FirebaseFirestore.getInstance();
    DocumentReference userRef,appointmentRef,couponRef;
    DocumentReference slotRef;
    TextView payment;
    ImageView close;
    String dateString,doctorId,slotString,slotId,clinicName;
    Dialog confirmDialog;
    Button confirm;
    TextView cancel,message;
    Button btnClinic,btnOnline;
    Long appointInt;
    String dayInt;
    EditText edtCoupon;
    Button btnCoupon;
    TextView couponStatus,payableAmount;
    String value="250";
    String fee="250";
    String couponCode;
    String email;
    TextView totalAmount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_appoinment);
        dateString=getIntent().getStringExtra("date");
        doctorId=getIntent().getStringExtra("doctorId");
        slotString=getIntent().getStringExtra("slot");
        slotId=getIntent().getStringExtra("slotId");
        type=getIntent().getStringExtra("type");
        dayInt=getIntent().getStringExtra("dayInt");
        clinicName=getIntent().getStringExtra("clinicName");

        appointmentRef=database.collection("appointment").document();

        notificationRef= Common.dbFireStore.collection(Common.notifications_ref).document();
        notificationRef1= Common.dbFireStore.collection(Common.notifications_ref).document();


        String timeInt  =dayInt+slotId;
     //   Toast.makeText(this, timeInt, Toast.LENGTH_SHORT).show();
        appointInt=Long.parseLong(timeInt.trim());

        userRef=database.collection("patients").document(FirebaseAuth.getInstance().getCurrentUser().getUid());

        slotRef = Common.dbFireStore.collection(Common.doctor_ref)
                .document(doctorId)
                .collection(Common.calendar_dates_ref).document(dayInt)
                .collection(Common.calendar_slots_ref)
                .document(slotId);

        name=findViewById(R.id.name);
        number=findViewById(R.id.number);
        date=findViewById(R.id.date);
        slot=findViewById(R.id.slot);
        payment =findViewById(R.id.payment);
        close=findViewById(R.id.close);
        appointType=findViewById(R.id.appointType);
        btnClinic=findViewById(R.id.btnClinic);
        btnOnline=findViewById(R.id.btnOnline);
        btnCoupon=findViewById(R.id.btnCoupon);
        edtCoupon=findViewById(R.id.edtCoupon);
        couponStatus=findViewById(R.id.couponStatus);
        payableAmount=findViewById(R.id.payableAmount);
        totalAmount=findViewById(R.id.total);


        if (getIntent().getStringExtra("fee") !=null){
            value=getIntent().getStringExtra("fee");
            fee=getIntent().getStringExtra("fee");
            totalAmount.setText("₹"+fee);
            payableAmount.setText("₹"+fee);
        }else {
            totalAmount.setText("₹"+fee);
            payableAmount.setText("₹"+fee);
        }


        confirmDialog =new Dialog(this);

        slot.setText(slotString);
        date.setText(dateString);

        if (type.equals("Telemedicine")){
            payment.setText("In telemedicine, only online payment is supported");
            btnClinic.setVisibility(View.GONE);
        }else {
            payment.setText("Either pay at clinic or pay online");
            btnClinic.setVisibility(View.VISIBLE);
        }

        appointType.setText(type);

        btnCoupon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hideKeyboard(AppoinmentActivity.this);
                if (TextUtils.isEmpty(edtCoupon.getText().toString())){
                    Toast.makeText(AppoinmentActivity.this, "Couple feild is empty", Toast.LENGTH_SHORT).show();
                }else {
                    couponRef=database.collection(Common.coupon_ref).document(edtCoupon.getText().toString().toUpperCase());
                    couponRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                        @Override
                        public void onSuccess(DocumentSnapshot snapshot) {
                            if (snapshot.exists()){
                                Integer total=Integer.parseInt(fee);
                                int persent=Integer.valueOf(snapshot.get("value").toString());
                                int effectvalue=total*persent/100;
                                int payable= total-effectvalue;
                                couponCode=snapshot.get("name").toString();
                                value=String.valueOf(payable);
                                payableAmount.setText("₹"+value);
                                couponStatus.setText("Coupon code "+snapshot.get("name").toString()+" applied");
                                couponStatus.setTextColor(getResources().getColor(R.color.green));

                                Toast.makeText(AppoinmentActivity.this, "Coupon successfully applied", Toast.LENGTH_SHORT).show();
                            }else {
                                Toast.makeText(AppoinmentActivity.this, "Coupon not exist", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }).addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Toast.makeText(AppoinmentActivity.this, "Coupon not applied", Toast.LENGTH_SHORT).show();
                        }
                    });
                }

            }
        });

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


        btnClinic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                confirmDialog.setContentView(R.layout.app_exit_conform_card_layout);
                cancel=(TextView)confirmDialog.findViewById(R.id.cancel);
                message=(TextView)confirmDialog.findViewById(R.id.message);
                confirm=(Button) confirmDialog.findViewById(R.id.exit);

                message.setText("Are you sure you want to confirm this appointment?");
                confirm.setText("Confirm");

                cancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        confirmDialog.dismiss();
                    }
                });

                final Map<String, Object> updateInfo = new HashMap<>();
                updateInfo.put("name", name.getText().toString());
                updateInfo.put("number", number.getText().toString());
                updateInfo.put("date",dateString);
                updateInfo.put("slot",slotString );
                updateInfo.put("doctorId", doctorId);
                updateInfo.put("paymentStatus" ,"false");
                updateInfo.put("viewtype", 0);
                updateInfo.put("fee",value);

                updateInfo.put("appointInt",appointInt);

                if (email !=null){
                    updateInfo.put("email",email);
                }

                updateInfo.put("status", "Scheduled");
                updateInfo.put("patientId",FirebaseAuth.getInstance().getCurrentUser().getUid());
                updateInfo.put("type","In Clinic");
                updateInfo.put("payment","In Clinic");
                updateInfo.put("clinicId",Common.appointmentInfo.get("clinicId"));
                updateInfo.put("clinicName",clinicName);
                updateInfo.put("createAt", Timestamp.now());

                if (value.equals(fee)){
                    updateInfo.put("couponCode","false");
                }else {
                    updateInfo.put("couponCode",couponCode);
                }

                final Map<String, Object> slotInfo = new HashMap<>();
                slotInfo.put("status","booked");
                slotInfo.put("type", Arrays.asList(type));
                slotInfo.put("appointId",appointmentRef.getId());

                String content="Your appointment is confirmed on " + date.getText().toString() +" at "+slot.getText().toString();
                final Map<String, Object> notificationInfoDoctor = new HashMap<>();
                notificationInfoDoctor.put("title","Appointment scheduled");
                notificationInfoDoctor.put("content", content);
                notificationInfoDoctor.put("appointId",appointmentRef.getId());
                notificationInfoDoctor.put("type","appointment");
                notificationInfoDoctor.put("doctorId", doctorId);

                final Map<String, Object> notificationInfoPatient = new HashMap<>();
                notificationInfoPatient.put("title","Appointment scheduled");
                notificationInfoPatient.put("content", content);
                notificationInfoPatient.put("appointId",appointmentRef.getId());
                notificationInfoPatient.put("type","appointment");
                notificationInfoPatient.put("patientId", Common.mAuth.getCurrentUser().getUid());


                confirm.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        WriteBatch batch = Common.dbFireStore.batch();
                        batch.set(appointmentRef, updateInfo);
                        batch.update(slotRef, slotInfo);
                        batch.set(notificationRef,notificationInfoDoctor);
                        batch.set(notificationRef1,notificationInfoPatient);
                        batch.commit().addOnCompleteListener(new OnCompleteListener<Void>() {
                            @Override
                            public void onComplete(@NonNull Task<Void> task) {
                                Intent intent =new Intent(AppoinmentActivity.this, MainActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                startActivity(intent);
                                Toast.makeText(AppoinmentActivity.this, "Appointment Confirm", Toast.LENGTH_LONG).show();
                                confirmDialog.dismiss();
                            }
                        });


                    }
                });

                confirmDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                confirmDialog.show();
            }
        });

        btnOnline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                confirmDialog.setContentView(R.layout.app_exit_conform_card_layout);
                cancel=(TextView)confirmDialog.findViewById(R.id.cancel);
                message=(TextView)confirmDialog.findViewById(R.id.message);
                confirm=(Button) confirmDialog.findViewById(R.id.exit);


                message.setText("Are you sure you want to confirm this appointment?");
                confirm.setText("Confirm");

                cancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        confirmDialog.dismiss();
                    }
                });

                final Map<String, Object> updateInfo = new HashMap<>();
                updateInfo.put("name", name.getText().toString());
                updateInfo.put("number", number.getText().toString());
                updateInfo.put("date",dateString);
                updateInfo.put("appointInt",appointInt);
                updateInfo.put("slot",slotString );
                updateInfo.put("doctorId", doctorId);
                updateInfo.put("paymentStatus" ,"false");
                updateInfo.put("viewtype", 0);

                if (email !=null){
                    updateInfo.put("email",email);
                }

                updateInfo.put("status", "Scheduled");
                updateInfo.put("patientId",FirebaseAuth.getInstance().getCurrentUser().getUid());
                updateInfo.put("type",type);
                updateInfo.put("clinicName",clinicName);
                updateInfo.put("payment","Prepaid");
                updateInfo.put("paymentStatus" ,"false");
                updateInfo.put("slotId",slotId);
                updateInfo.put("createAt", Timestamp.now());

                if (value !=null){
                    updateInfo.put("fee",value);
                }else {
                    updateInfo.put("fee",fee);
                }


                confirm.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(AppoinmentActivity.this, PaymentActivity.class);
                        intent.putExtra("map", (Serializable) updateInfo);
                        intent.putExtra("slotId",slotId);
                        intent.putExtra("dayInt",dayInt);
                        startActivity(intent);
                        confirmDialog.dismiss();

                    }
                });

                confirmDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                confirmDialog.show();
            }
        });

        getDate(userRef);

    }

    public void getDate(DocumentReference userRef){

        userRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot snapshot, @Nullable FirebaseFirestoreException error) {
                if (snapshot.get("name") !=null) name.setText(snapshot.get("name").toString());
                //   if (snapshot.get("email") ==null) email.setText(snapshot.get("email").toString());
                if (snapshot.get("number") !=null) number.setText(snapshot.get("number").toString());
                if (snapshot.get("email") !=null) email=snapshot.get("email").toString();
            }
        });

    }

    public static void hideKeyboard(Activity activity) {
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        //Find the currently focused view, so we can grab the correct window token from it.
        View view = activity.getCurrentFocus();
        //If no view currently has focus, create a new one, just so we can grab a window token from it
        if (view == null) {
            view = new View(activity);
        }
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }


}