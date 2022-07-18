package in.healthtalk.patientTest.adapter;

import android.app.Dialog;
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

import in.healthtalk.patientTest.Appointment.AppoinmentActivity;
import in.healthtalk.patientTest.Common.Common;
import in.healthtalk.patientTest.R;
import in.healthtalk.patientTest.Model.Slot;

public class SlotAdapter1 extends RecyclerView.Adapter<SlotAdapter1.SlotViewHolder> {
    private List<Slot> list;
    TextView notFound;
    ProgressBar progressBar;
    Context context;
    Dialog slotChangeDialog;
    String dayInt;
    String date,doctorId,type,fee,cliniqName;

    public SlotAdapter1(List<Slot> list, TextView notFound, ProgressBar progressBar,
                        Context context, String dayInt,String date,String doctorId,String type,String fee,String cliniqName) {
        this.list = list;
        this.notFound=notFound;
        this.progressBar=progressBar;
        this.context=context;
        this.dayInt=dayInt;
        this.date=date;
        this.doctorId=doctorId;
        this.fee=fee;
        this.type=type;
        this.cliniqName=cliniqName;

    }

    @NonNull
    @Override
    public SlotViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.slot_layout, parent, false);
        return new SlotViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SlotViewHolder viewHolder, int position) {
        slotChangeDialog =new Dialog(context);
        progressBar.setVisibility(View.GONE);
        notFound.setVisibility(View.GONE);

        String name= list.get(position).getName();
        viewHolder.name.setText(name);
        String slotInt=String.valueOf(list.get(position).getSlotInt());

        String currentStutus=list.get(position).getStatus();


        if (currentStutus.equals("false")){
            viewHolder.name.setBackground(context.getResources().getDrawable(R.drawable.btnred));
        }else  if (currentStutus.equals("booked")){
            viewHolder.name.setBackground(context.getResources().getDrawable(R.drawable.btn));

        }else if(currentStutus.equals("true")){
            viewHolder.name.setBackground(context.getResources().getDrawable(R.drawable.btngreen));

        }

        viewHolder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, AppoinmentActivity.class);

                Common.appointmentInfo.put("slot",list.get(position).getName());
                Common.appointmentInfo.put("slotId",String.valueOf(list.get(position).getSlotInt()));

                intent.putExtra("date",date);
                intent.putExtra("doctorId",doctorId);
                intent.putExtra("slot",list.get(position).getName());
                intent.putExtra("slotId",String.valueOf(list.get(position).getSlotInt()));
                intent.putExtra("type",type);
                intent.putExtra("dayInt",dayInt);
                intent.putExtra("fee",fee);
                intent.putExtra("clinicName",cliniqName);
                context.startActivity(intent);

            }


        });

    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public class SlotViewHolder extends RecyclerView.ViewHolder {
        TextView name;
        SlotViewHolder(View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.name);
        }

    }
}