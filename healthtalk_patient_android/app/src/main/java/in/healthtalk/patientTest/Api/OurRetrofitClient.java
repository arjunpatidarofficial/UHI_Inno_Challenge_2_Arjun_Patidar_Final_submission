package in.healthtalk.patientTest.Api;

import in.healthtalk.patientTest.Model.AgoraToken;
import in.healthtalk.patientTest.Model.PostModel;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface OurRetrofitClient {

        @POST("getAgoraRTCToken")
        Call<AgoraToken> getTokenValue(@Body PostModel postModel);

}
