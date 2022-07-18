package in.healthtalk.patientTest.Auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import in.healthtalk.patientTest.R;

public class LoginActivity extends AppCompatActivity {
    private Button btnLogin;
    EditText txtPhone;
    boolean isNumber=false,isPrivacy;
    ImageView close;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        btnLogin=findViewById(R.id.btnLogin);
        txtPhone = findViewById(R.id.phone);


        close=findViewById(R.id.close);

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String code = "+91";
                String number = txtPhone.getText().toString().trim();

                if (number.isEmpty()) {
                    txtPhone.setError("Valid number is required");
                    txtPhone.requestFocus();
                    isNumber=false;
                }else if (number.length() != 10){
                    txtPhone.setError("Valid number is required");
                    txtPhone.requestFocus();
                    isNumber=false;
                }else {
                    isNumber=true;
                }


                if (isNumber){
                    String phoneNumber = code + number;
                    Intent intent = new Intent(LoginActivity.this, VerificationActivity.class);
                    intent.putExtra("phone", phoneNumber);
                    startActivity(intent);

                }


            }
        });

    }
}