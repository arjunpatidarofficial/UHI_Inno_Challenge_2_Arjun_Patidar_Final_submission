package in.healthtalk.patientTest.History;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;

import com.squareup.picasso.Callback;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;

import in.healthtalk.patientTest.R;

public class HistoryViewActivity extends AppCompatActivity {

    ImageView img;
    String imgString;
    ImageView close;
    ProgressBar progressbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history_view);

        imgString=getIntent().getStringExtra("img");
        close=findViewById(R.id.close);
        img=findViewById(R.id.img);

        progressbar=findViewById(R.id.progressbar);

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        Picasso.get().load(imgString).networkPolicy(NetworkPolicy.OFFLINE).into(img, new Callback() {
            @Override
            public void onSuccess() {
                progressbar.setVisibility(View.GONE);
            }

            @Override
         public void onError(Exception e) {
                Picasso.get().load(imgString).into(img);
                progressbar.setVisibility(View.GONE);

            }
        });

    }
}