import { AppComponent } from "./../app.component";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Animation, AnimationController } from "@ionic/angular";
import { interval } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("daddy", { static: true }) daddy: ElementRef;
  @ViewChild("dayCurve", { static: true }) dayCurve: ElementRef;
  @ViewChild("skySphere", {static: true}) skySphere: ElementRef;
  
  animation: Animation;
  constructor(
    private animationCtrl: AnimationController,
    private parentComponent: AppComponent
  ) {}

  timeInMinutes: number;
  timeInHours: number;
  dayPercentage: number = 0;
  oldPercentage: number = -20;

  theGreeting: string = "Good day";
  ngOnInit() {
    console.log(this.theGreeting);
    this.calculateDayPercentage();

    interval(60000).subscribe((val) => this.everyMinute(val));
  }

  calculateDayPercentage() {
    this.oldPercentage = this.dayPercentage;

    var d = new Date();
    this.timeInMinutes = d.getMinutes();
    this.timeInHours = d.getHours();
    console.log(this.timeInHours, this.timeInMinutes);

    let dayPercent = (this.timeInHours / 24) * 100;
    console.log("dayPercent", dayPercent);

    let timePercent = (this.timeInMinutes / 60) * 10;
    console.log("timePercent", timePercent);

    this.dayPercentage = Number((dayPercent + timePercent).toFixed(2));
    console.log("Total day percentage =", this.dayPercentage);
  }

  everyMinute(val) {
    this.calculateDayPercentage();
    this.updateDay();
    console.log("one minute has passed");
  }

  async ngAfterViewInit() {
    this.animation = this.animationCtrl.create("myanimation");

    const greetingAnimation = this.animationCtrl
      .create()
      .addElement(this.container.nativeElement)
      .duration(2000)
      .easing("ease-out")
      .iterations(1)
      .fromTo("opacity", 0, 1);

    const backgroundAnimation = this.animationCtrl
      .create()
      .addElement(this.daddy.nativeElement)
      .duration(3000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, background: "var(--ion-background-color)" },
        { offset: 1, background: "#121212" },
      ]);

    const opening = this.animationCtrl
      .create()
      .duration(3000)
      .iterations(1)
      .addAnimation([greetingAnimation, backgroundAnimation]);

    await opening.play();

    const greetingAnimationGoodbye = this.animationCtrl
      .create()
      .addElement(this.container.nativeElement)
      .duration(3000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, opacity: 1 },
        { offset: 0.5, opacity: 1 },
        { offset: 1, opacity: 0 },
      ]);

    const postOpening = this.animationCtrl
      .create()
      .duration(5000)
      .iterations(1)
      .addAnimation([greetingAnimationGoodbye]);

    await postOpening.play();

    this.turnToDay();
  }

  turnToDay() {
    const dayCurveOpen = this.animationCtrl
      .create()
      .addElement(this.dayCurve.nativeElement)
      .duration(10000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        {
          offset: 0,
          opacity: 0,
          transform: "scale(3)",
          top: `${this.oldPercentage}%`,
        },
        {
          offset: 1,
          opacity: 1,
          transform: "scale(1)",
          top: `${this.dayPercentage}%`,
        },
      ]);

    const backgroundToDay = this.animationCtrl
      .create()
      .addElement(this.daddy.nativeElement)
      .duration(7500)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, background: "#121212" },
        { offset: 1, background: "rgb(64,196,255)" },
      ]);

      const raiseTheSkySphere = this.animationCtrl
      .create()
      .addElement(this.skySphere.nativeElement)
      .duration(7000)
      .easing("ease-out")
      .keyframes([
        {
          offset: 0,
          opacity: 0,
          transform: "scale(.5)",
          top: `20%`,
          left: `${this.oldPercentage}%`
        },
        {
          offset: 1,
          opacity: 1,
          transform: "scale(1)",
          top: `20px`,
          left: `${this.dayPercentage}%`
        },
      ]);

    const turnToDaySequence = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([dayCurveOpen, backgroundToDay, raiseTheSkySphere]);

    turnToDaySequence.play();
  }

  updateDay() {
    const dayCurveOpen = this.animationCtrl
      .create()
      .addElement(this.dayCurve.nativeElement)
      .duration(10000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, top: `${this.oldPercentage}%` },
        { offset: 1, top: `${this.dayPercentage}%` },
      ]);

    const updateDayMinute = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([dayCurveOpen]);

    updateDayMinute.play();
  }

/*   changeGlowColor(color:string){
   document.documentElement.style.setProperty('--dynamic-colour', color);
} */
}
