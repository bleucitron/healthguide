import homeApp from './home';
import stressApp from './app-exercise-stress';
import stressApp2 from './app-exercise-stress-2';
import workspaceApp from './app-guide-workspace';
import postureApp from './app-guide-posture';
import breathApp from './app-guide-breath';
import pelvisApp from './app-exercise-pelvis';
import abdominalApp from './app-exercise-abdominal';

const appsTemplates = {
    home: homeApp,
    'app-exercise-stress': stressApp,
    'app-exercise-stress-2': stressApp2,
    'app-guide-workspace': workspaceApp,
    'app-guide-posture': postureApp,
    'app-guide-breath': breathApp,
    'app-exercise-pelvis': pelvisApp,
    'app-exercise-abdominal': abdominalApp
};

export default appsTemplates;