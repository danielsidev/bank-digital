import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as cors from 'cors';
import * as helmet from 'helmet';
import { Register } from "./routes/index";

class App {
  public app: express.Application;
  public port: number;
  public register: Register;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.API_PORT);
        this.initializeMiddlewares();
        this.initializeRoutes();
     }
    public listen() {
        this.app.listen(this.port, () => {
        console.log(`App listening on the port ${this.port}`);
        });
     }
    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(helmet());
        this.app.set( "views", path.join( __dirname, "views" ) );
        this.app.set( "view engine", "ejs" );
        this.app.use('/public', express.static(__dirname + '/public'));
        this.app.use(( err, req, res, next) => {
          console.error(err.stack); 
          res.status(500).send({ error: 'Something failed!' });
        });        
     }
    private initializeRoutes() {
        this.register = new Register(this.app);
        this.register.setRoutes();
     }
}

export default App;
