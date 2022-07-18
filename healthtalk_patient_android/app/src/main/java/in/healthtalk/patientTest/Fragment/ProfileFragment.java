package in.healthtalk.patientTest.Fragment;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

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
import in.healthtalk.patientTest.Others.AboutActivity;
import in.healthtalk.patientTest.Auth.LoginActivity;
import in.healthtalk.patientTest.Auth.ProfileImageActivity;
import in.healthtalk.patientTest.Auth.ProfileViewActivity;
import in.healthtalk.patientTest.R;

public class ProfileFragment extends Fragment {

    CircleImageView profileImg;
    DocumentReference currentUserRef;
    String img_string;
    Button editprofile;
    TextView about,logout;
    TextView name,number;
    Dialog logoutDialog;
    Button exit;
    TextView cancel,message;


    public ProfileFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view =  inflater.inflate(R.layout.fragment_profile, container, false);

        currentUserRef= FirebaseFirestore.getInstance()
                .collection("patients")
                .document(FirebaseAuth.getInstance().getCurrentUser().getUid());

        profileImg=view.findViewById(R.id.profileImg);
        editprofile=view.findViewById(R.id.editprofile);
        about=view.findViewById(R.id.about);
        name=view.findViewById(R.id.name);
        number=view.findViewById(R.id.number);
        logout=view.findViewById(R.id.logout);

        logoutDialog =new Dialog(getContext());

        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                logoutDialog.setContentView(R.layout.app_exit_conform_card_layout);
                cancel=(TextView)logoutDialog.findViewById(R.id.cancel);
                message=(TextView)logoutDialog.findViewById(R.id.message);
                exit=(Button) logoutDialog.findViewById(R.id.exit);

                message.setText("Are You sure you want to Logout this app? You progress will be saved for the session.");
                exit.setText("Logout");

                cancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        logoutDialog.dismiss();
                    }
                });

                exit.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        FirebaseAuth.getInstance().signOut();
                        Intent intent =new Intent(getContext(), LoginActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                    }
                });

                logoutDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                logoutDialog.show();
            }
        });



        profileImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(getContext(), ProfileImageActivity.class);
                intent.putExtra("img_string",img_string);
                startActivity(intent);
            }
        });

        editprofile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(getContext(), ProfileViewActivity.class);
                startActivity(intent);
            }
        });




        about.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(getContext(), AboutActivity.class);
                startActivity(intent);
            }
        });


        return view;

    }

    @Override
    public void onStart() {
        super.onStart();
            currentUserRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
                @Override
                public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirebaseFirestoreException error) {

                    if (value.get("name") !=null) name.setText(value.get("name").toString());

                    if (value.get("number") !=null) number.setText(value.get("number").toString());

                      if (value.get("img") !=null ){
                          img_string=value.get("img").toString();
                    Picasso.get().load(img_string).placeholder(R.drawable.profile_image).networkPolicy(NetworkPolicy.OFFLINE).into(profileImg, new Callback() {
                        @Override
                        public void onSuccess() {

                        }

                        @Override
                        public void onError(Exception e) {
                            Picasso.get().load(img_string).placeholder(R.drawable.profile_image).into(profileImg);
                        }
                    });
                      }
                }
            });

    }
}