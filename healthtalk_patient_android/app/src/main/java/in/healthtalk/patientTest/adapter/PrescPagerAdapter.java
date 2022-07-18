package in.healthtalk.patientTest.adapter;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import in.healthtalk.patientTest.History.PastPresFragment;

public class PrescPagerAdapter extends FragmentPagerAdapter {

    private Context myContext;
    int totalTabs;

    public PrescPagerAdapter(Context context, FragmentManager fm, int totalTabs) {
        super(fm);
        myContext = context;
        this.totalTabs = totalTabs;
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                PastPresFragment pastPresFragment = new PastPresFragment();
                return pastPresFragment;
            default:
                return null;
        }
    }

    @Override
    public int getCount() {
        return totalTabs;
    }
}
