package in.healthtalk.patientTest.Model;

public class PostModel {
    private String uid,channelName;

    public PostModel() {
    }

    public PostModel(String uid, String channelName) {
        this.uid = uid;
        this.channelName = channelName;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }
}

