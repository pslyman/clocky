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
  @ViewChild("skySphere", { static: true }) skySphere: ElementRef;
  @ViewChild("dateTime", { static: true }) dateTime: ElementRef;

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

  time = new Date();

  isDay = true;

  ngOnInit() {
    this.calculateDayPercentage();
    this.updateColorsByTime();

    interval(60000).subscribe((val) => this.everyMinute(val));
    setInterval(() => {
      this.time = new Date();
    }, 1000);
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

    if (this.dayPercentage >= 25 || this.dayPercentage < 75) {
      let modifier: number;
      modifier = ((this.dayPercentage - 25) * 100) / (75 - 25);
      console.log("modifier = ", modifier);
      this.dayPercentage = modifier;

      this.isDay = true;
    } else {
      if (this.dayPercentage < 25) {
        let modifier: number;
        modifier = ((this.dayPercentage - 0) * 100) / (25 - 0);
        console.log("modifier = ", modifier);
        this.dayPercentage = modifier;

        this.isDay = false;
      } else {
        let modifier: number;
        modifier = ((this.dayPercentage - 75) * 100) / (100 - 75);
        console.log("modifier = ", modifier);
        this.dayPercentage = modifier;

        this.isDay = false;
      }
    }

    /* Debugger */
/*     this.dayPercentage = 78;
    this.isDay = false; */
  }

  everyMinute(val) {
    this.calculateDayPercentage();
    if ((this.dayPercentage = 75)) {
      this.transitionToEvening();
    } else if ((this.dayPercentage = 25)) {
      this.turnToDay;
    } else {
      this.updateDayOrNight();
    }

    console.log("one minute has passed");
    this.updateColorsByTime();
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
        { offset: 1, opacity: 0 },
      ]);

    const postOpening = this.animationCtrl
      .create()
      .duration(5000)
      .iterations(1)
      .addAnimation([greetingAnimationGoodbye]);

    await postOpening.play();

    if (this.isDay) {
      this.turnToDay();
    } else {
      this.turnToEvening();
    }
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
          transform: "scale(0)",
          top: `20%`,
          left: `${this.oldPercentage}%`,
        },
        {
          offset: 0.8,
          opacity: 0,
          transform: "scale(.5)",
          top: `20%`,
          left: `${this.oldPercentage}%`,
        },
        {
          offset: 1,
          opacity: 1,
          transform: "scale(1)",
          top: `20px`,
          left: `${this.dayPercentage}%`,
        },
      ]);

    const clockAppear = this.animationCtrl
      .create()
      .addElement(this.dateTime.nativeElement)
      .duration(5000)
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

    const turnToDaySequence = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([
        dayCurveOpen,
        backgroundToDay,
        raiseTheSkySphere,
        clockAppear,
      ]);

    turnToDaySequence.play();
  }

  transitionToEvening() {
    const dayCurveOpen = this.animationCtrl
      .create()
      .addElement(this.dayCurve.nativeElement)
      .duration(10000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        {
          offset: 0,
          opacity: 1,
          transform: "scale(1)",
          bottom: `${this.oldPercentage}%`,
          background: "rgb(64,196,255)",
        },
        {
          offset: 1,
          opacity: 0,
          transform: "scale(3)",
          bottom: `${this.dayPercentage}%`,
          background: "black",
        },
      ]);

    const backgroundToDay = this.animationCtrl
      .create()
      .addElement(this.daddy.nativeElement)
      .duration(7500)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, background: "rgb(64,196,255)" },
        { offset: 1, background: "black" },
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
          top: `20%`,
          left: `${this.oldPercentage}%`,
          background: "#ffe89e",
        },
        {
          offset: 1,
          opacity: 1,
          top: `${this.dayPercentage}%`,
          left: `50%`,
          background: "grey",
        },
      ]);

    const clockAppear = this.animationCtrl
      .create()
      .addElement(this.dateTime.nativeElement)
      .duration(5000)
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

    const turnToDaySequence = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([
        dayCurveOpen,
        backgroundToDay,
        raiseTheSkySphere,
        clockAppear,
      ]);

    turnToDaySequence.play();
  }

  turnToEvening() {
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
          transform: "scale(1)",
          bottom: `${this.oldPercentage}%`,
          background: "black",
        },
        {
          offset: 1,
          opacity: 0,
          transform: "scale(3)",
          bottom: `${this.dayPercentage}%`,
          background: "black",
        },
      ]);

    const backgroundToDay = this.animationCtrl
      .create()
      .addElement(this.daddy.nativeElement)
      .duration(7500)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, background: "black" },
        { offset: 1, background: "black" },
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
          top: `20%`,
          left: `${this.oldPercentage}%`,
          background: "#ffe89e",
        },
        {
          offset: 1,
          opacity: 1,
          top: `${this.dayPercentage}%`,
          left: `50%`,
          background: "grey",
        },
      ]);

    const clockAppear = this.animationCtrl
      .create()
      .addElement(this.dateTime.nativeElement)
      .duration(5000)
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

    const turnToDaySequence = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([
        dayCurveOpen,
        backgroundToDay,
        raiseTheSkySphere,
        clockAppear,
      ]);

    turnToDaySequence.play();
  }

  addMinute() {
    this.dayPercentage++;
    console.log("dayPercentage now ", this.dayPercentage);

    this.updateDayOrNight();
    this.updateColorsByTime();
  }

  updateDayOrNight() {
    if (this.isDay) {
      this.updateDay();
      console.log("updateDay");
    } else {
      this.updateNight();
      console.log("updateNight");
    }
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

    const updateSkySphere = this.animationCtrl
      .create()
      .addElement(this.skySphere.nativeElement)
      .duration(7000)
      .easing("ease-out")
      .keyframes([
        {
          offset: 0,
          left: `${this.oldPercentage}%`,
        },

        {
          offset: 1,
          left: `${this.dayPercentage}%`,
        },
      ]);

    const updateClockPosition = this.animationCtrl
      .create()
      .addElement(this.dateTime.nativeElement)
      .duration(5000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        {
          offset: 0,
          top: `${this.oldPercentage}%`,
        },
        {
          offset: 1,
          top: `${this.dayPercentage}%`,
        },
      ]);

    const updateDayMinute = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([dayCurveOpen, updateSkySphere, updateClockPosition]);

    updateDayMinute.play();
  }

  updateNight() {
    const updateSkySphere = this.animationCtrl
      .create()
      .addElement(this.skySphere.nativeElement)
      .duration(7000)
      .easing("ease-out")
      .keyframes([
        {
          offset: 0,
          top: `${this.oldPercentage}%`,
        },

        {
          offset: 1,
          top: `${this.dayPercentage}%`,
        },
      ]);

    const updateClockPosition = this.animationCtrl
      .create()
      .addElement(this.dateTime.nativeElement)
      .duration(5000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        {
          offset: 0,
          bottom: `${this.oldPercentage}%`,
        },
        {
          offset: 1,
          bottom: `${this.dayPercentage}%`,
        },
      ]);

    const updateNightMinute = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([updateSkySphere, updateClockPosition]);

    updateNightMinute.play();
  }

  updateColorsByTime() {
    if (this.dayPercentage < 64 && this.dayPercentage > 25) {
      this.changeGlowColor("#3880ff");
    } else if (this.dayPercentage > 75) {
      this.changeGlowColor("#ffcb2200");
    } else if (this.dayPercentage > 65 || this.dayPercentage < 76) {
      this.changeGlowColor("#ff2277");
    }
  }

  changeGlowColor(color: string) {
    document.documentElement.style.setProperty("--ion-sunset-primary", color);
  }
}
