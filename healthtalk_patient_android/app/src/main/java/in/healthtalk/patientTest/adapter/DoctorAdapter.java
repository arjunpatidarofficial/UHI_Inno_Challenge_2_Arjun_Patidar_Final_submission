package in.healthtalk.patientTest.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.firebase.firestore.DocumentSnapshot;

import de.hdodenhof.circleimageview.CircleImageView;
import in.healthtalk.patientTest.AppoinmentSubActivity;
import in.healthtalk.patientTest.CalendarActivity;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.R;

import com.squareup.picasso.Callback;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;

import java.util.Map;

import in.healthtalk.patientTest.Model.Doctor;

public class DoctorAdapter extends FirestoreRecyclerAdapter<Doctor, DoctorAdapter.DoctorHolder> {

    ProgressBar progressBar;
    Context context;
    TextView notFound;
    String type;
    String address;
    Map<String , Object> oldAppointMentInfo;
    String viewType;

    public DoctorAdapter(@NonNull FirestoreRecyclerOptions<Doctor> options,
                         ProgressBar progressBar, Context context,TextView notFound,String type,
                         String address) {
        super(options);
        this.progressBar=progressBar;
        this.context=context;
        this.notFound=notFound;
        this.type=type;
        this.address=address;
    }
    @Override
    protected void onBindViewHolder(@NonNull DoctorHolder holder, int position, @NonNull Doctor model) {
        holder.name.setText(model.getName());
      // holder.specialist.setText(model.getSpecialist());
       holder.fee.setText("₹"+model.getFee());
        holder.address.setText(model.getProfile());
        holder.specialist.setText(model.getSpecialist());
        notFound.setVisibility(View.GONE);

        Picasso.get().load(model.getImg()).placeholder(R.drawable.profile_image).networkPolicy(NetworkPolicy.OFFLINE).into(holder.img, new Callback() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(Exception e) {
                Picasso.get().load(model.getImg()).placeholder(R.drawable.profile_image).into(holder.img);
            }
        });

        progressBar.setVisibility(View.GONE);


        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

             String  viewType = (String) Common.oldAppointmentInfo.get("viewType");


                DocumentSnapshot snapshot = getSnapshots().getSnapshot(holder.getAdapterPosition());
                snapshot.getId();

                if(viewType.equals("secondary")){

                    Intent intent = new Intent(context, AppoinmentSubActivity.class);

                    if (type.equals("Telemedicine"))
                        Common.appointmentInfo.put("clinicId","none");
                    intent.putExtra("date",(String) Common.oldAppointmentInfo.get("date"));
                    intent.putExtra("doctorId",snapshot.getId());
                    intent.putExtra("docName",model.getName());
                    intent.putExtra("slot",(String) Common.oldAppointmentInfo.get("slot"));
//                   intent.putExtra("slotId",123456);
                    intent.putExtra("type",type);
//                   intent.putExtra("dayInt",43432);
                    intent.putExtra("fee",model.getFee());
                    intent.putExtra("clinicName","none");
                    context.startActivity(intent);


                }else{
                    Intent intent =new Intent(context, CalendarActivity.class);
                    Common.appointmentInfo.put("doctorId",snapshot.getId());
                    Common.appointmentInfo.put("fee",model.getFee());
                    if (type.equals("Telemedicine"))
                        Common.appointmentInfo.put("clinicId","none");
                    intent.putExtra("doctorId",snapshot.getId());
                    intent.putExtra("type",type);
                    intent.putExtra("fee",model.getFee());
                    intent.putExtra("address",address);
                    context.startActivity(intent);
                }




            }
        });

    }


    @NonNull
    @Override
    public DoctorHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.doctor_card_layout,
                parent, false);
        return new DoctorHolder(v);
    }
    class DoctorHolder extends RecyclerView.ViewHolder {
        TextView name,specialist,fee,address;
        CircleImageView img;

        public DoctorHolder(View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.name);
            img = itemView.findViewById(R.id.img);
            name = itemView.findViewById(R.id.name);
            specialist = itemView.findViewById(R.id.specialist);
            fee = itemView.findViewById(R.id.fee);
            address = itemView.findViewById(R.id.address);

        }

    }


}