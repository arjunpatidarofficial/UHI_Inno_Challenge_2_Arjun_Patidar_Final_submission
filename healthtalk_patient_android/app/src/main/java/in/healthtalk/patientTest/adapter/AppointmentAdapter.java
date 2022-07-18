package in.healthtalk.patientTest.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;

import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.squareup.picasso.Callback;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;

import de.hdodenhof.circleimageview.CircleImageView;
import in.healthtalk.patientTest.Appointment.AppointmentViewActivity;
import in.healthtalk.patientTest.Model.Appointment;
import in.healthtalk.patientTest.R;
import in.healthtalk.patientTest.ViewPdfActivity;

public class AppointmentAdapter extends FirestoreRecyclerAdapter<Appointment, AppointmentAdapter.AppointmentHolder> {

    Context context;
    FirebaseFirestore firebaseFirestore=FirebaseFirestore.getInstance();
    DocumentReference doctorRef,UserRef;
    TextView notFound;
    ProgressBar progressBar;

    public AppointmentAdapter(@NonNull FirestoreRecyclerOptions<Appointment> options, Context context,ProgressBar progressBar,TextView notFound) {
        super(options);
        this.context=context;
        this.notFound=notFound;
        this.progressBar=progressBar;
    }
    @Override
    protected void onBindViewHolder(@NonNull AppointmentHolder holder, int position, @NonNull Appointment model) {
      // holder.number.setText(model.getNumber());
       String doctorId=model.getDoctorId();
       holder.date.setText(model.getDate());
        holder.status.setText(model.getStatus());
        holder.slot.setText(model.getSlot());
        holder.type.setText(model.getType());

        notFound.setVisibility(View.GONE);


        if (model.getPresCreateAt() != null){
            holder.prescription.setVisibility(View.VISIBLE);
        }else {
            holder.prescription.setVisibility(View.GONE);
        }


        holder.prescription.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DocumentSnapshot snapshot = getSnapshots().getSnapshot(holder.getAdapterPosition());
                Intent intent =new Intent(context, ViewPdfActivity.class);
                intent.putExtra("appointId",snapshot.getId());
                context.startActivity(intent);
            }
        });

        if (model.getStatus().equals("Scheduled")){
            holder.status.setText("Scheduled");
            holder.status.setBackground(context.getResources().getDrawable(R.drawable.btnyellow));

        }else {
                holder.status.setVisibility(View.GONE);

        }

       doctorRef=firebaseFirestore.collection("doctors").document(doctorId);

       doctorRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
           @Override
           public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirebaseFirestoreException error) {
               String docImg=value.get("img").toString();
               String docName=value.get("name").toString();
               String specialist=value.get("specialist").toString();

               holder.name.setText(docName);
               holder.number.setText(specialist);


               Picasso.get().load(docImg).placeholder(R.drawable.profile_image).networkPolicy(NetworkPolicy.OFFLINE).into(holder.img, new Callback() {
                   @Override
                   public void onSuccess() {
                       progressBar.setVisibility(View.GONE);
                   }

                   @Override
                   public void onError(Exception e) {
                       Picasso.get().load(docImg).placeholder(R.drawable.profile_image).into(holder.img);
                   }
               });

           }
       });

      // holder.fee.setText("₹"+model.getFee());


        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DocumentSnapshot snapshot = getSnapshots().getSnapshot(holder.getAdapterPosition());
                snapshot.getId();
                Intent intent =new Intent(context, AppointmentViewActivity.class);
                intent.putExtra("id",snapshot.getId());
                context.startActivity(intent);

            }
        });


    }
    @NonNull
    @Override
    public AppointmentHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.appointment_card_layout,
                parent, false);
        return new AppointmentHolder(v);
    }
    class AppointmentHolder extends RecyclerView.ViewHolder {
        TextView name,number,date,slot,status,type,prescription;
        CircleImageView img;

        public AppointmentHolder(View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.name);
            img = itemView.findViewById(R.id.img);
            number = itemView.findViewById(R.id.number);
            date = itemView.findViewById(R.id.date);
            slot = itemView.findViewById(R.id.slot);
            status = itemView.findViewById(R.id.status);
            type=itemView.findViewById(R.id.type);
            prescription=itemView.findViewById(R.id.prescription);

        }

    }


}