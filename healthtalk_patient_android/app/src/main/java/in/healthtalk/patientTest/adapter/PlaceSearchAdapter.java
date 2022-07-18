package in.healthtalk.patientTest.adapter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import in.healthtalk.patientTest.R;
import java.util.ArrayList;


public class PlaceSearchAdapter extends RecyclerView.Adapter<PlaceSearchAdapter.SearchViewHolder> {
    Context context;
    ArrayList<String> placeList;
    ArrayList<String> placeHiList;
    ProgressBar progressBar;
    Activity activity;
    String type;


    class SearchViewHolder extends RecyclerView.ViewHolder {
        TextView city;

        public SearchViewHolder(View itemView) {
            super(itemView);
            city =itemView.findViewById(R.id.city);
        }
    }

    public PlaceSearchAdapter(Context context, ArrayList<String> placeList, ArrayList<String> placeHiList,
                              ProgressBar progressBar, Activity activity, String type) {
        this.context = context;
        this.placeHiList = placeHiList;
        this.placeList = placeList;
        this.progressBar=progressBar;
        this.activity=activity;
        this.type=type;
    }

    @Override
    public SearchViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.city_card_layout, parent, false);
        return new SearchViewHolder(view);
    }

    @Override
    public void onBindViewHolder(SearchViewHolder holder, final int position) {
        holder.city.setText(placeList.get(position));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.putExtra("place", placeList.get(position));
                activity.setResult(Activity.RESULT_OK, intent);
                activity.finish();

            }
        });
    }

    @Override
    public int getItemCount() {
        return placeList.size();
    }
}
