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

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.Model.Slot;
import in.healthtalk.patientTest.adapter.SlotAdapter1;

public class SlotViewActivity extends AppCompatActivity {

    ProgressBar progressBar;
    String date,doctorId,type,fee;
    TextView txtHeader;
    ImageView close;
    TextView notfound;
    RecyclerView recyclerView;
    String dayInt;
    Query slotRef;
    String address;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_slot_view);

        date = getIntent().getStringExtra("date");
        doctorId = getIntent().getStringExtra("doctorId");
        type=getIntent().getStringExtra("type");
        dayInt=getIntent().getStringExtra("dayInt");
        fee=getIntent().getStringExtra("fee");
        address=getIntent().getStringExtra("address");


        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new GridLayoutManager(this, 2));

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String currentDateandTime = sdf.format(new java.util.Date());
        int currentDatInt=Integer.valueOf(currentDateandTime);


        if (currentDatInt==Integer.valueOf(dayInt)){

            if (type.equals("Telemedicine")){
                slotRef =Common.dbFireStore.collection(Common.doctor_ref)
                        .document(doctorId)
                        .collection(Common.calendar_dates_ref).document(dayInt).collection(Common.calendar_slots_ref)
                        .whereGreaterThan("slotInt",getTimeInteger())
                        .whereEqualTo("status","true").whereArrayContains("type", "Telemedicine");
            }else {
                slotRef =Common.dbFireStore.collection(Common.doctor_ref)
                        .document(doctorId)
                        .collection(Common.calendar_dates_ref).document(dayInt).collection(Common.calendar_slots_ref)
                        .whereGreaterThan("slotInt",getTimeInteger())
                        .whereEqualTo("status","true")
                        .whereArrayContains("type", "In Clinic")
                        .whereEqualTo("address",address);
            }

        }else {
            if (type.equals("Telemedicine")){
                slotRef =Common.dbFireStore.collection(Common.doctor_ref)
                        .document(doctorId)
                        .collection(Common.calendar_dates_ref).document(dayInt).collection(Common.calendar_slots_ref)
                        .whereEqualTo("status","true").whereArrayContainsAny("type", Arrays.asList("Telemedicine"));
            }else {
                slotRef =Common.dbFireStore.collection(Common.doctor_ref)
                        .document(doctorId)
                        .collection(Common.calendar_dates_ref).document(dayInt).collection(Common.calendar_slots_ref)
                        .whereEqualTo("status","true")
                        .whereArrayContainsAny("type", Arrays.asList("In Clinic"))
                        .whereEqualTo("address",address);
            }

        }

        progressBar = findViewById(R.id.progressbar);
        notfound = findViewById(R.id.notFound);
        txtHeader = findViewById(R.id.txtHeader);
        close = findViewById(R.id.close);

       txtHeader.setText("Date " + date.toString() + " Time slot");


        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        getSlotList();
    }


    public void getSlotList() {
        super.onStart();
        progressBar.setVisibility(View.VISIBLE);

        slotRef.addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error!=null){
                    progressBar.setVisibility(View.GONE);
                    notfound.setText("Something went wrong");
                }else {
                    List<Slot> slotList=new ArrayList<>();
                    for (DocumentSnapshot snapshot: value){
                        Slot slot=snapshot.toObject(Slot.class);
                        slotList.add(slot);
                    }
                    if (slotList.size() == 0){
                        notfound.setVisibility(View.VISIBLE);
                        progressBar.setVisibility(View.GONE);
                    }else {
                        SlotAdapter1 slotAdapter=new SlotAdapter1(slotList,notfound,progressBar,
                                SlotViewActivity.this,dayInt,date,doctorId,type,fee,address);
                        recyclerView.setAdapter(slotAdapter);
                    }
                }

            }
        });

    }

    public int getTimeInteger(){
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Calcutta"));
        Date currentLocalTime = cal.getTime();
        DateFormat date1 = new SimpleDateFormat("HH:mm a");
        date1.setTimeZone(TimeZone.getTimeZone("Asia/Calcutta"));
        String localTime = date1.format(currentLocalTime);
        String AMPM,time,finalTime;
        if (localTime.substring(6).equals("am") || localTime.substring(6).equals("AM"))
            AMPM="1";
        else AMPM="2";

        time = localTime.substring(0,2)+localTime.substring(3,5);

        if (AMPM.equals("2")){
            int finalhour =Integer.parseInt(localTime.substring(0,2))-12;
            if (String.valueOf(finalhour).length() ==1){
                finalTime=AMPM+"0"+String.valueOf(finalhour)+localTime.substring(3,5);
            }else {
                finalTime=AMPM+String.valueOf(finalhour)+localTime.substring(3,5);
            }
        }else {
            time=localTime.substring(0,2)+localTime.substring(3,5);
            finalTime=AMPM+time;
        }

        // Toast.makeText(this,finalTime, Toast.LENGTH_SHORT).show();

        return Integer.valueOf(finalTime);

    }


}
