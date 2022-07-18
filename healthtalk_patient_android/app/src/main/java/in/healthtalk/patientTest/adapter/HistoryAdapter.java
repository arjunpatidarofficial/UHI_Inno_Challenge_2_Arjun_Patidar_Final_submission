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
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentSnapshot;

import in.healthtalk.patientTest.History.HistoryViewActivity;
import in.healthtalk.patientTest.Model.History;
import in.healthtalk.patientTest.R;

public class HistoryAdapter extends FirestoreRecyclerAdapter<History, HistoryAdapter.HistoryHolder> {

    ProgressBar progressBar;
    Context context;
    TextView notFound;

    public HistoryAdapter(@NonNull FirestoreRecyclerOptions<History> options, ProgressBar progressBar, Context context, TextView notFound) {
        super(options);
        this.progressBar=progressBar;
        this.context=context;
        this.notFound=notFound;
    }
    @Override
    protected void onBindViewHolder(@NonNull HistoryHolder holder, int position, @NonNull History model) {

      //  SimpleDateFormat sfd = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        Timestamp timestamp=model.getCreateAt();
        String first,second,finalstring;
        first=timestamp.toDate().toString().substring(0,16);
        second=timestamp.toDate().toString().substring(30,34);
        holder.time.setText(first + " " + second);

        holder.view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(context, HistoryViewActivity.class);
                intent.putExtra("img",model.getImg());
                context.startActivity(intent);
            }
        });

//        holder.name.setText(model.getName());
//      // holder.specialist.setText(model.getSpecialist());
//       holder.fee.setText("₹"+model.getFee());
//        holder.address.setText("Address:- "+model.getAddress());
//        holder.specialist.setText(model.getSpecialist());

//        Picasso.get().load(model.getImg()).networkPolicy(NetworkPolicy.OFFLINE).into(holder.img, new Callback() {
//            @Override
//            public void onSuccess() {
//            }
//
//            @Override
//            public void onError(Exception e) {
//                Picasso.get().load(model.getImg()).into(holder.img);
//            }
//        });

        progressBar.setVisibility(View.GONE);
        notFound.setVisibility(View.GONE);



        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DocumentSnapshot snapshot = getSnapshots().getSnapshot(holder.getAdapterPosition());
                snapshot.getId();
               // Intent intent =new Intent(context, CalendarActivity.class);
               // intent.putExtra("doctorId",snapshot.getId());
               // intent.putExtra("type",type);
             //  context.startActivity(intent);
            }
        });

    }


    @NonNull
    @Override
    public HistoryHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.history_card_layout,
                parent, false);
        return new HistoryHolder(v);
    }
    class HistoryHolder extends RecyclerView.ViewHolder {
        TextView time,view;
      //  CircleImageView img;

        public HistoryHolder(View itemView) {
            super(itemView);
            time = itemView.findViewById(R.id.time);
            view=itemView.findViewById(R.id.view);

         //   img = itemView.findViewById(R.id.img);
         //   name = itemView.findViewById(R.id.name);
         //   specialist = itemView.findViewById(R.id.specialist);
         //   fee = itemView.findViewById(R.id.fee);
         //   address = itemView.findViewById(R.id.address);

        }

    }


}