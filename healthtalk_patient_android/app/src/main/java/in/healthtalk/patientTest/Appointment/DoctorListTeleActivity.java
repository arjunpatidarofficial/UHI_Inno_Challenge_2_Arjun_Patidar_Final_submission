package in.healthtalk.patientTest.Appointment;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.Model.Doctor;
import in.healthtalk.patientTest.R;
import in.healthtalk.patientTest.adapter.DoctorAdapter;

public class DoctorListTeleActivity extends AppCompatActivity {

    String appointId ,doctorId ,docName,date,time;
    String viewType ;

    TextView txtHeader;
    ImageView close;
    TextView notFound;

    ProgressBar progresbar;

    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private DoctorAdapter adapter;
    private CollectionReference doctorRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_doctor_list_tele);

        viewType=getIntent().getStringExtra("type");
        if(getIntent().getStringExtra("type").equals("secondary")){
            appointId=getIntent().getStringExtra("appointId");
            doctorId=getIntent().getStringExtra("doctorId");
            docName=getIntent().getStringExtra("docName");
            date=getIntent().getStringExtra("date");
            time=getIntent().getStringExtra("slot");
        }

        txtHeader=findViewById(R.id.txtHeader);
        close=findViewById(R.id.close);
        notFound=findViewById(R.id.notFound);

        doctorRef = db.collection("doctors");

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        setUpRecyclerView();

    }

    private void setUpRecyclerView() {

        Query query = doctorRef.whereEqualTo("verify", true);

        FirestoreRecyclerOptions<Doctor> options = new FirestoreRecyclerOptions.Builder<Doctor>()
                .setQuery(query, Doctor.class)
                .build();

        Common.oldAppointmentInfo.put("doctorId",doctorId);
        Common.oldAppointmentInfo.put("appointId",appointId);
        Common.oldAppointmentInfo.put("docName",docName);
        Common.oldAppointmentInfo.put("viewType",viewType);
        Common.oldAppointmentInfo.put("date",date);
        Common.oldAppointmentInfo.put("slot",time);

        progresbar=findViewById(R.id.progresbar);
        adapter = new DoctorAdapter(options,progresbar,this,notFound,"Telemedicine","none");
        RecyclerView recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new GridLayoutManager(this, 1));
        recyclerView.setAdapter(adapter);
        if (adapter.getItemCount()==0){
            progresbar.setVisibility(View.GONE);
        }
    }
    @Override
    protected void onStart() {
        super.onStart();
        adapter.startListening();
    }
    @Override
    protected void onStop() {
        super.onStop();
        adapter.stopListening();
    }
}