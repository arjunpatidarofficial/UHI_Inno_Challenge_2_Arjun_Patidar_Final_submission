import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthProvider } from './contexts';
import { Signin } from './pages/signin';
import { Contact } from './pages/contactForm';
import { DocProfile } from './pages/Profile';
import { Signup } from './pages/signup';
import { Telemedicine } from './pages/doctor/telemidicine/telemedicine';
import { DoctorDetailsInput } from './pages/doctor/docDetails';
import { DocHome } from './pages/doctor/docHome';
import { Appointments } from './pages/doctor/docAppointments';
import { Calander } from './pages/doctor/docCalander';
import { History } from './pages/doctor/docHistory';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <div className='App'>
            <Route path='/' exact component={Signin} />
            <Route path='/signin' exact component={Signin} />
            <Route path='/signup' exact component={Signup} />
            <Route path='/contact' exact component={Contact} />
            <Route path='/docprofile' exact component={DocProfile} />
            <Route path='/docHome' exact component={DocHome} />
            <Route
              path='/telemedicine/:appId/:type/:guid'
              component={Telemedicine}
            />
            <Route path='/docDetails' exact component={DoctorDetailsInput} />

            <Route path='/docAppointments' exact component={Appointments} />
            <Route path='/docCalander' exact component={Calander} />
            <Route path='/docHistory' exact component={History} />

            {/* <Route path='/camp' exact component={Camp} /> */}
            {/* <Route path='/camp/:action/:campId' exact component={Exam} /> */}
            {/* <Route path='/privacyPolicies' exact component={Privacy} /> */}

            {/* <Route path='/comingSoon' exact component={ComingSoon} /> */}

            {/* <Route path='/home' exact component={Home} /> */}
            {/* <Route path='/form' exact component={Form} /> */}
            {/* <Route path='/prescribe/:appId/:type' component={InClinic} /> */}
            {/* <Route
              path='/singleAppointment'
              exact
              component={SingleAppointment}
            /> */}
            {/* <Route path="/searchUser" exact component={NewUser} /> */}

            {/* <Route path='/earnings' exact component={Earnings} /> */}
            {/* <Route
              path='/docUserHome/:number/:foundAt'
              exact
              component={DocUserDetails}
            /> */}
            {/* <Route path='/searchUser' exact component={SearchUser} /> */}
            {/* <Route path='/addUser/:number' exact component={Add} /> */}
            {/* <Route
              path='/editUser/:patientId/:foundAt'
              exact
              component={Edit}
            /> */}
            {/* <Route
              path='/showUser/:patientId/:foundAt'
              exact
              component={Show}
            /> */}
            {/* <Route
              path='/consultation/:patientId/:foundAt'
              exact
              component={Consultation}
            /> */}
            {/* <Route
              path='/previousConsultations/:patientId/:foundAt'
              exact
              component={PreviousConsultations}
            /> */}

            {/* <Route
              path='/docList/:type/:clinicId/:clinicName'
              component={DocList}
            /> */}
            {/* <Route path='/clinicList' exact component={ClinicList} />
            <Route path='/labList' exact component={LabList} />
            <Route
              path='/calendar/:type/:docId/:clinicId/:clinicName'
              component={Calendar}
            />
            <Route path='/patientHome' exact component={PatientHome} /> */}
            {/* <Route path='/login' exact component={Plogin} />
            <Route
              path='/book/:type/:docId/:dayInt/:slotName/:time/:clinicId/:clinicName'
              component={BookAppointment}
            />
            <Route path='/appointments' exact component={MyAppointments} /> */}
            {/* <Route path='/labTests' exact component={MyTests} /> */}
            {/* <Route
              path='/appointment/:appId'
              exact
              component={PatientSingleAppointment}
            /> */}
            {/* <Route
              path='/patient/teleconsult/:appId/:dname'
              exact
              component={PatientVideoCall}
            /> */}
            {/* <Route path='/userInput' exact component={UserProfileInput} />
            <Route path='/userProfile' exact component={UserProfile} />
            <Route path='/consultations' exact component={PrevConsultations} />
            <Route path='/bookTest/:labId' exact component={BookLabTest} />
            <Route path='/buyMedicine' exact component={BuyMedicine} />
            <Route path='/homeVisit' exact component={HomeVisit} /> */}
            {/* 
            <Route path='/nurse_login' exact component={NurseSignin} />
            <Route path='/nurse_signup' exact component={NurseSignup} />
            <Route path='/nurse' exact component={SearchUserNurse} /> */}

            {/* <Route
              path='/lab_provider_login'
              exact
              component={LabProviderLogin}
            />
            <Route
              path='/lab_provider_signup'
              exact
              component={LabProviderSignup}
            />
            <Route
              path='/lab_provider_dashboard'
              exact
              component={LabDashboard}
            />
            <Route
              path='/lab_provider_bookings'
              exact
              component={LabBookings}
            />
            <Route
              path='/lab_provider_all_tests'
              exact
              component={LabAllTests}
            />
            <Route
              path='/lab_provider_history'
              exact
              component={LabBookingHistory}
            /> */}
          </div>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
