package in.healthtalk.patientTest.Others;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;

import in.healthtalk.patientTest.Auth.LoginActivity;
import in.healthtalk.patientTest.Auth.UpdateProfileActivity;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.IntroActivity;
import in.healthtalk.patientTest.MainActivity;
import in.healthtalk.patientTest.R;
public class WelcomeActivity extends AppCompatActivity {
    private int SPLASH_TIME_OUT=1000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

        if (getIntent().hasExtra("id")){
            Intent intent =new Intent(WelcomeActivity.this, MainActivity.class);
            intent.putExtra("id",getIntent().getStringExtra("id"));
        }
    }
    @Override
    protected void onStart() {
        super.onStart();

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {

                if (Common.mAuth.getCurrentUser() != null){
                        DocumentReference patientRef=Common.dbFireStore.collection(Common.patient_ref).document(Common.mAuth.getCurrentUser().getUid());
                        patientRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                            @Override
                            public void onSuccess(DocumentSnapshot snapshot) {
                                if (snapshot.get("name") ==null){
                                    Intent intent= new Intent(getApplicationContext(), UpdateProfileActivity.class);
                                    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                    intent.putExtra("type","login");
                                    startActivity(intent);
                                    finish();
                                }else {
                                    Intent intent= new Intent(getApplicationContext(), MainActivity.class);
                                    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                    startActivity(intent);
                                    finish();
                                }
                            }
                        });
                }else{
                    Common.pref = getApplicationContext().getSharedPreferences("myPrefs",MODE_PRIVATE);
                    Common.isIntroActivityOpnendBefore = Common.pref.getBoolean("isIntroOpnend",false);
                    if (Common.isIntroActivityOpnendBefore) {
                        Intent mainActivity = new Intent(getApplicationContext(), LoginActivity.class);
                        startActivity(mainActivity);
                        finish();
                    }else {
                        Intent intent= new Intent(WelcomeActivity.this, IntroActivity.class);
                        startActivity(intent);
                        finish();
                    }
                }
            }

        },SPLASH_TIME_OUT);

    }
}