import MainScreen from './screens/main-screen/index';
import Model from './model/index';

const model = new Model();
const mainScreen = new MainScreen(model);

mainScreen.init();
mainScreen.addEventListeners();
MainScreen.addEventListeners2();
