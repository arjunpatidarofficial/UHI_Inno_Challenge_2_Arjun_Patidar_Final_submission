package in.healthtalk.patientTest;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;

import in.healthtalk.patientTest.Appointment.AppointmentViewActivity;
import in.healthtalk.patientTest.Fragment.AppointmentFragment;
import in.healthtalk.patientTest.Fragment.HistoryFragment;
import in.healthtalk.patientTest.Fragment.HomeFragment;
import in.healthtalk.patientTest.Fragment.ProfileFragment;

public class MainActivity extends AppCompatActivity {

    ImageView image1,image3,image4,image5;

    private FrameLayout frameLayout;
    private HomeFragment homeFragment;
    private AppointmentFragment appointmentFragment;
    private ProfileFragment profileFragment;
    private HistoryFragment historyFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        if (getIntent().hasExtra("id")){
            Intent intent =new Intent(MainActivity.this, AppointmentViewActivity.class);
            intent.putExtra("id",getIntent().getStringExtra("id"));
            startActivity(intent);
        }

        image1=findViewById(R.id.image1);
        image4=findViewById(R.id.image4);
        image5=findViewById(R.id.image5);
        frameLayout=findViewById(R.id.framLayout);

        homeFragment=new HomeFragment();
        profileFragment =new ProfileFragment();
        appointmentFragment =new AppointmentFragment();

        setFragment(homeFragment);

        image1=findViewById(R.id.image1);
        image3=findViewById(R.id.image3);
        image4=findViewById(R.id.image4);
        image5=findViewById(R.id.image5);


        homeFragment=new HomeFragment();
        profileFragment =new ProfileFragment();
        historyFragment = new HistoryFragment();

        setFragment(homeFragment);

        image1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setFragment(homeFragment);
                image1.setImageResource(R.drawable.homeactive);
                image3.setImageResource(R.drawable.history);
                image4.setImageResource(R.drawable.calendar);
                image5.setImageResource(R.drawable.profile);

            }
        });

        image3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setFragment(historyFragment);
                image1.setImageResource(R.drawable.home);
                image3.setImageResource(R.drawable.historyactive);
                image4.setImageResource(R.drawable.calendar);
                image5.setImageResource(R.drawable.profile);

            }
        });

        image4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setFragment(appointmentFragment);
                image1.setImageResource(R.drawable.home);
                image3.setImageResource(R.drawable.history);
                image4.setImageResource(R.drawable.calendaractive);
                image5.setImageResource(R.drawable.profile);

            }
        });

        image5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setFragment(profileFragment);
                image1.setImageResource(R.drawable.home);
                image3.setImageResource(R.drawable.history);
                image4.setImageResource(R.drawable.calendar);
                image5.setImageResource(R.drawable.profileactive);

            }
        });

    }

    public void setFragment(Fragment fragment){
        FragmentTransaction fragmentTransaction=getSupportFragmentManager().beginTransaction();
        fragmentTransaction.replace(R.id.framLayout,fragment);
        fragmentTransaction.commit();
    }



}