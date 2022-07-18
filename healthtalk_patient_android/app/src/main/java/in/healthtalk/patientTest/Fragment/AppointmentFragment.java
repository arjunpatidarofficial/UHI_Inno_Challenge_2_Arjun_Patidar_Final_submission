package in.healthtalk.patientTest.Fragment;

import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import in.healthtalk.patientTest.Model.Appointment;
import in.healthtalk.patientTest.R;
import in.healthtalk.patientTest.adapter.AppointmentAdapter;

public class AppointmentFragment extends Fragment {

    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private AppointmentAdapter adapter;
    private CollectionReference appointmentRef;
    ProgressBar progressBar;
    TextView notFound;

    public AppointmentFragment() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_appointment, container, false);

        progressBar=view.findViewById(R.id.progressbar);
        notFound=view.findViewById(R.id.notFound);

        appointmentRef = db.collection("appointment");

        Query query=appointmentRef.whereEqualTo("patientId", FirebaseAuth.getInstance().getCurrentUser().getUid())
                .whereEqualTo("status","Scheduled").orderBy("appointInt",Query.Direction.ASCENDING);


        FirestoreRecyclerOptions<Appointment> options = new FirestoreRecyclerOptions.Builder<Appointment>()
                .setQuery(query, Appointment.class)
                .build();

        adapter = new AppointmentAdapter(options,getContext(),progressBar,notFound);
        RecyclerView recyclerView = view.findViewById(R.id.recycler_view);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new GridLayoutManager(getContext(), 1));
        recyclerView.setAdapter(adapter);
        if (adapter.getItemCount() ==0){
            progressBar.setVisibility(View.GONE);
        }

        return view;
    }


    @Override
    public void onStart() {
        super.onStart();
        adapter.startListening();
    }
    @Override
    public void onStop() {
        super.onStop();
        adapter.stopListening();
    }

}