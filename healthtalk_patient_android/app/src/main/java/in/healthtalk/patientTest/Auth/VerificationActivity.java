package in.healthtalk.patientTest.Auth;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseException;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthOptions;
import com.google.firebase.auth.PhoneAuthProvider;
import com.google.firebase.auth.UserProfileChangeRequest;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.messaging.FirebaseMessaging;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.MainActivity;
import in.healthtalk.patientTest.R;

public class VerificationActivity extends AppCompatActivity {

    Button btnLogin;

    private String verificationId;
    private FirebaseAuth mAuth;
    DocumentReference notificationRef;

    LinearLayout progressLayout,verificationLayout;
    EditText txtCode;

    FirebaseFirestore firebaseFirestore=FirebaseFirestore.getInstance();
    DocumentReference documentReference;
    String phoneNumber;
    TextView number,editNumber,resend;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_verification);

        mAuth = FirebaseAuth.getInstance();
        notificationRef= Common.dbFireStore.collection(Common.notifications_ref).document();

        progressLayout = findViewById(R.id.progressLayout);
        verificationLayout=findViewById(R.id.verificationLayout);
        txtCode = findViewById(R.id.txtCode);
        btnLogin=findViewById(R.id.btnLogin);
        number=findViewById(R.id.number);
        editNumber=findViewById(R.id.editNumber);
        resend=findViewById(R.id.resend);

        if (getIntent().getStringExtra("phone") != null){
            phoneNumber = getIntent().getStringExtra("phone");
            number.setText(phoneNumber);
        }

        sendVerificationCode(phoneNumber);

        editNumber.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        resend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressLayout.setVisibility(View.VISIBLE);
                verificationLayout.setVisibility(View.GONE);
                sendVerificationCode(phoneNumber);
            }
        });



        // save phone number
        SharedPreferences prefs = getApplicationContext().getSharedPreferences("USER_PREF",
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("phoneNumber", phoneNumber);
        editor.apply();

        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String code = txtCode.getText().toString().trim();
                if (code.isEmpty()) {
                    txtCode.setError("Enter valid code");
                    txtCode.requestFocus();
                }else if(code.length() < 6){
                    txtCode.setError("Enter valid code");
                    txtCode.requestFocus();
                }else {
                    verifyCode(code);
                }

            }
        });
    }

    private void verifyCode(String code) {
        verificationLayout.setVisibility(View.GONE);
        progressLayout.setVisibility(View.VISIBLE);
        PhoneAuthCredential credential = PhoneAuthProvider.getCredential(verificationId, code);
        signInWithCredential(credential);
    }

    private void signInWithCredential(PhoneAuthCredential credential) {
        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            documentReference= firebaseFirestore.collection("patients")
                                    .document(FirebaseAuth.getInstance().getCurrentUser().getUid());

                            final Map<String, Object> updateInfo = new HashMap<>();
                            updateInfo.put("number",phoneNumber);

                            UserProfileChangeRequest profileUpdate = new UserProfileChangeRequest.Builder()
                                    .setDisplayName("patient").build();
                            FirebaseAuth.getInstance().getCurrentUser().updateProfile(profileUpdate);

                            documentReference.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                                @Override
                                public void onSuccess(DocumentSnapshot snapshot) {
                                    if (snapshot.exists()){
                                        documentReference.update(updateInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
                                            @Override
                                            public void onSuccess(Void aVoid) {
                                                setToken(documentReference);

                                                if (snapshot.get("name") !=null){
                                                    Intent intent = new Intent(VerificationActivity.this, MainActivity.class);
                                                    intent.putExtra("type","login");
                                                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                                    startActivity(intent);
                                                    finish();
                                                }else {
                                                    Intent intent = new Intent(VerificationActivity.this, UpdateProfileActivity.class);
                                                    intent.putExtra("type","login");
                                                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                                    startActivity(intent);
                                                    finish();
                                                }
                                            }
                                        });
                                    }else{
                                        documentReference.set(updateInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
                                            @Override
                                            public void onSuccess(Void aVoid) {
                                                setToken(documentReference);
                                                Intent intent = new Intent(VerificationActivity.this, UpdateProfileActivity.class);
                                                intent.putExtra("type","login");
                                                Toast.makeText(VerificationActivity.this, documentReference.getId() , Toast.LENGTH_SHORT).show();
                                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                                startActivity(intent);
                                                finish();
                                            }
                                        });}

                                }
                            });

                        } else {
                            Toast.makeText(VerificationActivity.this,"Please enter valid verification code", Toast.LENGTH_LONG).show();
                            verificationLayout.setVisibility(View.VISIBLE);
                            progressLayout.setVisibility(View.GONE);
                        }
                    }
                });
    }

    private void sendVerificationCode(String number) {
        progressLayout.setVisibility(View.VISIBLE);
        PhoneAuthOptions options =
                PhoneAuthOptions.newBuilder(mAuth)
                        .setPhoneNumber(number)
                        .setTimeout(120L, TimeUnit.SECONDS)
                        .setActivity(this)
                        .setCallbacks( new PhoneAuthProvider.OnVerificationStateChangedCallbacks() {

                            @Override
                            public void onCodeSent(String s, PhoneAuthProvider.ForceResendingToken forceResendingToken) {
                                super.onCodeSent(s, forceResendingToken);
                                verificationId = s;
                                progressLayout.setVisibility(View.GONE);
                                verificationLayout.setVisibility(View.VISIBLE);
                            }

                            @Override
                            public void onVerificationCompleted(PhoneAuthCredential phoneAuthCredential) {
                                String code = phoneAuthCredential.getSmsCode();
                                if (code != null) {
                                    txtCode.setText(code);
                                    verifyCode(code);
                                }
                            }

                            @Override
                            public void onVerificationFailed(FirebaseException e) {
                                Toast.makeText(VerificationActivity.this, e.getMessage(), Toast.LENGTH_LONG).show();
                                progressLayout.setVisibility(View.GONE);
                                finish();
                            }
                        })
                        .build();

        PhoneAuthProvider.verifyPhoneNumber(options);
    }





    public void setToken(DocumentReference patientRef){

        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Toast.makeText(VerificationActivity.this, "Fetching FCM registration token failed\"", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        // Get new FCM registration token
                        String token = task.getResult();

                        final Map<String, Object> updateInfo = new HashMap<>();
                        updateInfo.put("fcm", token);

                        patientRef.update(updateInfo).addOnSuccessListener(new OnSuccessListener<Void>() {
                            @Override
                            public void onSuccess(Void aVoid) {

                            }
                        }).addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Toast.makeText(VerificationActivity.this, "Fetching FCM registration token failed\"", Toast.LENGTH_SHORT).show();

                            }
                        });
                    }
                });
    }

}
