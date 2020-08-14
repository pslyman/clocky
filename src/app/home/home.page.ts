import { AppComponent } from "./../app.component";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Animation, AnimationController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("daddy", { static: true }) daddy: ElementRef;
  @ViewChild("dayCurve", { static: true }) dayCurve: ElementRef;
  animation: Animation;
  constructor(
    private animationCtrl: AnimationController,
    private parentComponent: AppComponent
  ) {}

  theGreeting: string = "Good day";
  ngOnInit() {
    console.log(this.theGreeting);
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
      .duration(7500)
      .easing("ease-out")
      .iterations(1)
      .keyframes([
        { offset: 0, opacity: 0, transform: "translateY(200%) scale(3)" },
        { offset: 1, opacity: 0.8, transform: "translateY(0) scale(1)" },
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

    const turnToDaySequence = this.animationCtrl
      .create()
      .duration(10000)
      .iterations(1)
      .addAnimation([dayCurveOpen, backgroundToDay]);

    turnToDaySequence.play();
  }
}
