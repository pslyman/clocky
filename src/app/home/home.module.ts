import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { StatusBar} from '@ionic-native/status-bar/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  providers: [Insomnia, AndroidFullScreen, NavigationBar, StatusBar],
  declarations: [HomePage]
})
export class HomePageModule {}
