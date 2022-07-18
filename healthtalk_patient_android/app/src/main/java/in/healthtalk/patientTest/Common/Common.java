package in.healthtalk.patientTest.Common;

import android.content.SharedPreferences;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import in.healthtalk.patientTest.Model.Test;

public class Common {

    public static final String city_ref="city";
    public static final String doctor_ref="doctors";
    public static final String patient_ref="patients";
    public static final String calendar_ref="calendar";
    public static final String slot_ref="slot";
    public static final String transaction_ref="transaction";
    public static final String appointment_ref="appointment";
    public static final String history_ref="history";
    public static final String coupon_ref="coupon";
    public static final String test_list_ref="testList";
    public static final String test_ref="test";
    public static final String payment_ref="transaction";
    public static final String notifications_ref="notifications";
    public static final String calendar_dates_ref="dates";
    public static final String calendar_slots_ref="slots";
    public static final String clinics_ref="clinics";
    public static final String covid_rt_pcr_test="covidRTPCR";

    public static final FirebaseFirestore dbFireStore=FirebaseFirestore.getInstance();
    public static final FirebaseDatabase dbDatabase=FirebaseDatabase.getInstance();
    public static final FirebaseAuth mAuth=FirebaseAuth.getInstance();



    public static final long API_CONNECTION_TIMEOUT = 1201;
    public static final long API_READ_TIMEOUT = 901;

    public static Map<String, Object> appointmentInfo = new HashMap<>();
    public static Map<String, Object> oldAppointmentInfo = new HashMap<>();
    public static Boolean isIntroActivityOpnendBefore=false;
    public  static  SharedPreferences pref;

    public static String city;
    public static List<Test> testList=new ArrayList<>();
   // public static Map<String, String> testList = new HashMap<>();

}
