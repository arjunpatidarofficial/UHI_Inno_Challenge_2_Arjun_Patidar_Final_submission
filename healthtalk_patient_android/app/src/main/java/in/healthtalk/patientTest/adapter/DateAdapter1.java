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
import java.util.List;

import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.Model.Date;
import in.healthtalk.patientTest.R;
import in.healthtalk.patientTest.SlotViewActivity;


public class DateAdapter1 extends RecyclerView.Adapter<DateAdapter1.DateViewHolder> {
    private List<Date> list;
    TextView notFound;
    ProgressBar progressBar;
    Context context;
    String type,doctorId,fee,address;

    public DateAdapter1(List<Date> list, TextView notFound, ProgressBar progressBar, Context context,String type,String doctorId,String fee,String address) {
        this.list = list;
        this.notFound=notFound;
        this.progressBar=progressBar;
        this.context=context;
        this.fee=fee;
        this.doctorId=doctorId;
        this.type=type;
        this.address=address;

    }

    @NonNull
    @Override
    public DateViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.date_layout, parent, false);
        return new DateViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DateViewHolder viewHolder, int position) {
        progressBar.setVisibility(View.GONE);
        notFound.setVisibility(View.GONE);

        String date = list.get(position).getDate();
        String day = list.get(position).getDayName();
        String finalDate;
        finalDate=date.substring(0,2)+" "+list.get(position).getMonthName()+" "+date.substring(6,10);
        viewHolder.date.setText(finalDate);
        viewHolder.day.setText(day);

        Integer dayInt=list.get(position).getDayInt();

        viewHolder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(context, SlotViewActivity.class);

                Common.appointmentInfo.put("date",date.toString());
                Common.appointmentInfo.put("dayInt",String.valueOf(dayInt));

                intent.putExtra("date",date.toString());
                intent.putExtra("doctorId",doctorId);
                intent.putExtra("dayInt",String.valueOf(dayInt));
                intent.putExtra("type",type);
                intent.putExtra("fee",fee);
                intent.putExtra("address",address);

                context.startActivity(intent);
            }
        });

    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public class DateViewHolder extends RecyclerView.ViewHolder {
        TextView day,date;
        DateViewHolder(View itemView) {
            super(itemView);
            day = itemView.findViewById(R.id.day);
            date=itemView.findViewById(R.id.date);
        }

    }
}