package in.healthtalk.patientTest.Appointment;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.cometchat.pro.constants.CometChatConstants;
import com.cometchat.pro.core.AppSettings;
import com.cometchat.pro.core.CometChat;
import com.cometchat.pro.exceptions.CometChatException;
import com.cometchat.pro.models.User;
import com.cometchat.pro.uikit.ui_components.messages.message_list.CometChatMessageListActivity;
import com.cometchat.pro.uikit.ui_resources.constants.UIKitConstants;
import com.cometchat.pro.uikit.ui_settings.UIKitSettings;
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

public class TelemadicineActivity extends AppCompatActivity {

    FirebaseFirestore firebaseFirestore=FirebaseFirestore.getInstance();
    DocumentReference doctorRef,appointmentRef;
    String appointId,doctorId;

    CircleImageView img;
    TextView txtName,txtSpecialist;
    ImageView close;
    TextView delayTime,hostStatus;
    Button btnCall;
    String hostStatusString="Doctor is Not Live";
    String docName;

    String appID = "214419b53fb54fed";
    String region = "us";
    String authKey = "5e92923b98c08fca2617f47822962f322d8eb592";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_telemadicine);

        txtName = findViewById(R.id.name);
        img = findViewById(R.id.img);
        txtSpecialist = findViewById(R.id.specialist);
        close=findViewById(R.id.close);
        delayTime=findViewById(R.id.delayTime);
        hostStatus=findViewById(R.id.hostStatus);
        btnCall=findViewById(R.id.btnCall);

        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 100);
        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.RECORD_AUDIO}, 101);
        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.MODIFY_AUDIO_SETTINGS}, 102);
        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.READ_PHONE_STATE}, 104);
        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.ACCESS_COARSE_LOCATION}, 105);
        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.ACCESS_FINE_LOCATION}, 106);
        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.READ_EXTERNAL_STORAGE}, 107);


        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

         btnCall.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        AppSettings appSettings=new AppSettings.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();

                        CometChat.init(TelemadicineActivity.this, appID,appSettings, new CometChat.CallbackListener<String>() {
                            @Override
                            public void onSuccess(String successMessage) {
                                UIKitSettings.setAuthKey(authKey);
                                CometChat.setSource("ui-kit","android","java");
                                Toast.makeText(TelemadicineActivity.this, "successMessage", Toast.LENGTH_SHORT).show();
                                login(FirebaseAuth.getInstance().getCurrentUser().getUid().toLowerCase(),authKey);
                            }
                            @Override
                            public void onError(CometChatException e) {
                                Toast.makeText(TelemadicineActivity.this, "onError", Toast.LENGTH_SHORT).show();
                            }
                        });

//                        if (hostStatusString.equals(FirebaseAuth.getInstance().getCurrentUser().getPhoneNumber())){
//                            Intent intent = new Intent(TelemadicineActivity.this, VideoChatViewActivity.class);
//                            intent.putExtra("channelName",docName);
//                            startActivity(intent);
//                        }else {
//                            Toast.makeText(TelemadicineActivity.this, "Host is Not Live", Toast.LENGTH_SHORT).show();
//                        }

                    }
                });

        appointId=getIntent().getStringExtra("id");
        doctorId=getIntent().getStringExtra("doctorId");

        appointmentRef=firebaseFirestore.collection("appointment").document(appointId);

        doctorRef=firebaseFirestore.collection(Common.doctor_ref).document(doctorId);

        doctorRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirebaseFirestoreException error) {

                if (value.get("name") != null) {
                    docName=value.get("name").toString();
                    txtName.setText(docName);
                }
                if (value.get("specialist") !=null){
                    String specialist=value.get("specialist").toString();
                    txtSpecialist.setText(specialist);
                }

                if (value.get("delay") !=null){
                    String delay =value.get("delay").toString();
                    delayTime.setText(delay);
                }


                if (value.get("hostStatus") !=null){
                    hostStatusString=value.get("hostStatus").toString();
                    if (hostStatusString.equals(FirebaseAuth.getInstance().getCurrentUser().getPhoneNumber())){
                        hostStatus.setText("Doctor is Live");
                        hostStatus.setTextColor(getResources().getColor(R.color.green));
                    }else {
                        hostStatus.setText("Doctor is Not Live");
                        hostStatus.setTextColor(getResources().getColor(R.color.red));
                    }

                }


                if (value.get("img") !=null) {
                    String docImg = value.get("img").toString();
                    Picasso.get().load(docImg).networkPolicy(NetworkPolicy.OFFLINE).into(img, new Callback() {
                        @Override
                        public void onSuccess() {
                        }

                        @Override
                        public void onError(Exception e) {
                            Picasso.get().load(docImg).into(img);
                        }
                    });
                }

            }
        });


    }

    public void login(String UID , String authKey){
        if (CometChat.getLoggedInUser() == null) {
            CometChat.login(UID, authKey, new CometChat.CallbackListener<User>() {

                @Override
                public void onSuccess(User user) {
                    Toast.makeText(TelemadicineActivity.this, "Login Successful", Toast.LENGTH_SHORT).show();

                    Intent intent = new Intent(TelemadicineActivity.this, CometChatMessageListActivity.class);
                    intent.putExtra(UIKitConstants.IntentStrings.NAME,docName);
                    intent.putExtra(UIKitConstants.IntentStrings.GROUP_OWNER,"app_system");
                    intent.putExtra(UIKitConstants.IntentStrings.GUID,appointId.toLowerCase());
                    intent.putExtra(UIKitConstants.IntentStrings.AVATAR,"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Akshaykumar.jpg/220px-Akshaykumar.jpg");
                    intent.putExtra(UIKitConstants.IntentStrings.GROUP_TYPE,"public");
                    intent.putExtra(UIKitConstants.IntentStrings.TYPE, CometChatConstants.RECEIVER_TYPE_GROUP);
                    intent.putExtra(UIKitConstants.IntentStrings.MEMBER_COUNT,2);

                    startActivity(intent);
                }

                @Override
                public void onError(CometChatException e) {
                    Toast.makeText(TelemadicineActivity.this, "Please wait doctor will start conversation", Toast.LENGTH_SHORT).show();
                }
            });
        } else {
            Intent intent = new Intent(TelemadicineActivity.this, CometChatMessageListActivity.class);
            intent.putExtra(UIKitConstants.IntentStrings.NAME,docName);
            intent.putExtra(UIKitConstants.IntentStrings.GROUP_OWNER,"app_system");
            intent.putExtra(UIKitConstants.IntentStrings.GUID,appointId.toLowerCase());
            intent.putExtra(UIKitConstants.IntentStrings.AVATAR,"https://firebasestorage.googleapis.com/v0/b/arjunpatidar-709f4.appspot.com/o/healthtalk.png?alt=media&token=af3794b5-3c96-424c-8e25-bdd213c581ba");
            intent.putExtra(UIKitConstants.IntentStrings.GROUP_TYPE,"public");
            intent.putExtra(UIKitConstants.IntentStrings.TYPE, CometChatConstants.RECEIVER_TYPE_GROUP);
            intent.putExtra(UIKitConstants.IntentStrings.MEMBER_COUNT,2);
            startActivity(intent);

        }
    }

}