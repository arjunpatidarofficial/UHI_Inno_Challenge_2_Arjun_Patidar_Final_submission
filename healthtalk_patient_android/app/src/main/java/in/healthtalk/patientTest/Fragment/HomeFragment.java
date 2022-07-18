package in.healthtalk.patientTest.Fragment;

import android.content.Intent;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import in.healthtalk.patientTest.Appointment.DoctorListTeleActivity;
import in.healthtalk.patientTest.R;

public class HomeFragment extends Fragment {

    LinearLayout telemedicine;


    public HomeFragment() {
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
        View view=  inflater.inflate(R.layout.fragment_home, container, false);

        telemedicine=view.findViewById(R.id.telemedicine);




        telemedicine.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getContext(), DoctorListTeleActivity.class);
                intent.putExtra("type","primary");
                startActivity(intent);
            }
        });


        return view;
    }


}