package in.healthtalk.patientTest;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

import in.healthtalk.patientTest.Appointment.AppointmentViewActivity;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        String title =remoteMessage.getNotification().getTitle();
        String body =remoteMessage.getNotification().getBody();

        Map<String ,String> data=remoteMessage.getData();
        String appointId =data.get("appointId");

        NotificationCompat.Builder notificationBuilder= new NotificationCompat.Builder(this,"TAC")
                .setContentTitle(title)
                .setContentText(body)
                .setSmallIcon(R.drawable.calendar);

        Intent intent =new Intent(this, AppointmentViewActivity.class);
        intent.putExtra("id",appointId);

        PendingIntent pendingIntent= PendingIntent.getActivity(this,10,intent,PendingIntent.FLAG_UPDATE_CURRENT);
        notificationBuilder.setContentIntent(pendingIntent);

        NotificationManager notificationManager=(NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        int id = (int ) System.currentTimeMillis();
        if (Build.VERSION.SDK_INT >=Build.VERSION_CODES.O){
            NotificationChannel channel=new NotificationChannel("TAC","demo",NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(channel);
        }
        notificationManager.notify(id,notificationBuilder.build());
        notificationManager.cancel(id);

    }
}



