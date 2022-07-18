package in.healthtalk.patientTest;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QuerySnapshot;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.Model.Date;
import in.healthtalk.patientTest.adapter.DateAdapter1;

public class CalendarActivity extends AppCompatActivity {

    ImageView addDate;
    FirebaseDatabase database;
    DatabaseReference databaseReference;
    ProgressBar progressBar;
    ImageView close;
    String doctorId,type,fee,address;
    TextView notfound;
    RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        database=FirebaseDatabase.getInstance();

        progressBar=findViewById(R.id.progresbar);
        notfound=findViewById(R.id.notfound);
        doctorId=getIntent().getStringExtra("doctorId");
        type=getIntent().getStringExtra("type");
        fee=getIntent().getStringExtra("fee");
        address=getIntent().getStringExtra("address");


         recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new GridLayoutManager(this, 1));

        close=findViewById(R.id.close);

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        getDateList();

    }


    public void getDateList() {
        super.onStart();
        progressBar.setVisibility(View.VISIBLE);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String currentDateandTime = sdf.format(new java.util.Date());

        com.google.firebase.firestore.Query dateRef =Common.dbFireStore.collection(Common.doctor_ref)
                .document(doctorId)
                .collection(Common.calendar_dates_ref)
                .whereGreaterThan("dayInt",Integer.valueOf(currentDateandTime)-1);

        dateRef.addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                List<Date> dateList=new ArrayList<>();
                for (DocumentSnapshot snapshot: value){
                    Date date=snapshot.toObject(Date.class);
                    dateList.add(date);
                }
                if (dateList.size() == 0){
                    notfound.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.GONE);
                }else {
                    DateAdapter1 dateAdapter =new DateAdapter1(dateList,notfound,progressBar, CalendarActivity.this,type,doctorId,fee,address);
                    recyclerView.setAdapter(dateAdapter);
                }
            }
        });


    }
}
