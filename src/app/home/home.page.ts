import { AppComponent } from "./../app.component";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Animation, AnimationController, Platform } from "@ionic/angular";
import { interval } from "rxjs";
import { Insomnia } from "@ionic-native/insomnia/ngx";
import { AndroidFullScreen } from "@ionic-native/android-full-screen/ngx";
import { NavigationBar } from "@ionic-native/navigation-bar/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { MobileAccessibility } from "@ionic-native/mobile-accessibility/ngx";

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
    private insomnia: Insomnia,
    private androidFullScreen: AndroidFullScreen,
    private navigationBar: NavigationBar,
    private statusBar: StatusBar,
    private platform: Platform,
    private mobileAccessibility: MobileAccessibility
  ) {}

  timeInMinutes: number;
  timeInHours: number;
  dayPercentage: number = 0;
  oldPercentage: number = -20;

  clockPercentageAdjustment: number = 0;
  oldClockPercentageAdjustment: number = 0;

  theGreeting: string = "Good morning";

  time = new Date();

  isDay = true;

  ngOnInit() {
    this.androidFullScreen
      .isImmersiveModeSupported()
      .then(() => console.log("Immersive mode supported"))
      .catch((err) => console.log(err));

    this.insomnia.keepAwake().then(
      () => console.log("success"),
      () => console.log("error")
    );

    this.platform.ready().then(() => {
      this.androidFullScreen
        .isImmersiveModeSupported()
        .then(() => console.log("Immersive mode supported"))
        .catch((err) => console.log(err));

      this.insomnia.keepAwake().then(
        () => console.log("success"),
        () => console.log("error")
      );

      this.statusBar.hide();
      this.mobileAccessibility.usePreferredTextZoom(false);
    });

    let autoHide: boolean = true;
    this.navigationBar.setUp(autoHide);

    this.calculateDayPercentage();
    this.updateColorsByTime();

    var d = new Date();
    this.timeInHours = d.getHours();
    this.timeInHours = (this.timeInHours / 24) * 100;

    if (this.timeInHours >= 0 && this.timeInHours <= 25) {
      this.theGreeting = "Have a good night";
    } else if (this.timeInHours >= 75 && this.timeInHours <= 100) {
      this.theGreeting = "Good evening";
    } else if (this.timeInHours >= 25 && this.timeInHours <= 50) {
      this.theGreeting = "Good morning";
    } else if (this.timeInHours >= 50 && this.timeInHours <= 75) {
      this.theGreeting = "Good afternoon";
    }

    interval(60000).subscribe((val) => this.everyMinute(val));
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  calculateDayPercentage() {
    this.oldPercentage = this.dayPercentage;
    this.oldClockPercentageAdjustment = this.clockPercentageAdjustment;

    var d = new Date();
    this.timeInMinutes = d.getMinutes();
    this.timeInHours = d.getHours();

    let dayPercent = (this.timeInHours / 24) * 100;

    let timePercent = (this.timeInMinutes / 60) * 10;

    this.dayPercentage = Number((dayPercent + timePercent).toFixed(2));

    if (this.dayPercentage > 80) {
      this.clockPercentageAdjustment = this.dayPercentage - 30;
    } else {
      this.clockPercentageAdjustment = this.dayPercentage;
    }

    /* debugger */
    /* this.dayPercentage = 87;
    this.isDay = false; */

    if (this.dayPercentage >= 15 && this.dayPercentage <= 85) {
      this.isDay = true;
    } else {
      this.isDay = false;
    }
    /* console.log("more than 25, day false"); */
  }

  everyMinute(val) {
    this.calculateDayPercentage();
    this.updateDay();

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
      .duration(2000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, background: "black" },
        { offset: 1, background: "#121212" },
      ]);

    const opening = this.animationCtrl
      .create()
      .duration(2000)
      .iterations(1)
      .addAnimation([greetingAnimation, backgroundAnimation]);

    await opening.play();

    const greetingAnimationGoodbye = this.animationCtrl
      .create()
      .addElement(this.container.nativeElement)
      .duration(1000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, opacity: 1 },
        { offset: 1, opacity: 0 },
      ]);

    const postOpening = this.animationCtrl
      .create()
      .duration(1000)
      .iterations(1)
      .addAnimation([greetingAnimationGoodbye]);

    await postOpening.play();

    this.turnToDay();
  }

  turnToDay() {
    const dayCurveOpen = this.animationCtrl
      .create()
      .addElement(this.dayCurve.nativeElement)
      .duration(7000)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        {
          offset: 0,
          opacity: 0,
          transform: "scale(1)",
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
        { offset: 1, background: "var(--ion-custom-background-primary)" },
      ]);

    const raiseTheSkySphere = this.animationCtrl
      .create()
      .addElement(this.skySphere.nativeElement)
      .duration(5000)
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
          top: `${this.oldClockPercentageAdjustment}%`,
        },
        {
          offset: 1,
          opacity: 1,
          transform: "scale(1)",
          top: `${this.clockPercentageAdjustment}%`,
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
          top: `${this.oldClockPercentageAdjustment}%`,
        },
        {
          offset: 1,
          top: `${this.clockPercentageAdjustment}%`,
        },
      ]);

    const updateDayMinute = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([dayCurveOpen, updateSkySphere, updateClockPosition]);

    updateDayMinute.play();
  }

  updateColorsByTime() {
    if (this.dayPercentage < 80 && this.dayPercentage > 25) {
      /* day */
      this.changeGlowColor("--ion-sunset-primary", "#3880ff");
      this.changeGlowColor("--ion-sphere-primary", "#ffe89e");
      this.changeGlowColor("--ion-sphere-rays-primary", "#ffca22");
      this.changeGlowColor(
        "--ion-custom-background-primary",
        "rgb(64,196,255)"
      );
      this.changeGlowColor("--ion-curve-primary", "#42d77d");
      this.changeGlowColor("--ion-curve-border-primary", "rgb(0, 109, 98)");
    } else if (this.dayPercentage > 80 && this.dayPercentage < 85) {
      /* sunset */
      this.changeGlowColor("--ion-sunset-primary", "#ff2277");
      this.changeGlowColor("--ion-sphere-primary", "#ffe89e");
      this.changeGlowColor("--ion-sphere-rays-primary", "#ffca22");
      this.changeGlowColor("--ion-custom-background-primary", "#1070be");
      this.changeGlowColor("--ion-curve-primary", "#42d77d");
      this.changeGlowColor("--ion-curve-border-primary", "rgb(0, 109, 98)");
    } else if (this.dayPercentage > 85 && this.dayPercentage < 101) {
      /* evening */
      this.changeGlowColor("--ion-sunset-primary", "#ffcb2200");
      this.changeGlowColor("--ion-sphere-primary", "#383838");
      this.changeGlowColor("--ion-sphere-rays-primary", "#101010");
      this.changeGlowColor("--ion-custom-background-primary", "black");
      this.changeGlowColor("--ion-curve-primary", "#383838");
      this.changeGlowColor("--ion-curve-border-primary", "#101010");
    } else if (this.dayPercentage > 0 && this.dayPercentage < 15) {
      /* evening still but smaller section */
      this.changeGlowColor("--ion-sunset-primary", "#ffcb2200");
      this.changeGlowColor("--ion-sphere-primary", "#383838");
      this.changeGlowColor("--ion-sphere-rays-primary", "#101010");
      this.changeGlowColor("--ion-custom-background-primary", "black");
      this.changeGlowColor("--ion-curve-primary", "#383838");
      this.changeGlowColor("--ion-curve-border-primary", "#101010");
    } else if (this.dayPercentage > 15 && this.dayPercentage < 25) {
      /* sunrise */
      this.changeGlowColor("--ion-sunset-primary", "#ff2277");
      this.changeGlowColor("--ion-sphere-primary", "#ffe89e");
      this.changeGlowColor("--ion-sphere-rays-primary", "#ffca22");
      this.changeGlowColor("--ion-custom-background-primary", "#94c2e7");
      this.changeGlowColor("--ion-curve-primary", "#42d77d");
      this.changeGlowColor("--ion-curve-border-primary", "rgb(0, 109, 98)");
    }
  }

  changeGlowColor(property: string, color: string) {
    document.documentElement.style.setProperty(property, color);
  }
}
