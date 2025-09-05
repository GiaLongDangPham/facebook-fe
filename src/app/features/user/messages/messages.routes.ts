import { Routes } from "@angular/router";
import { MessagePageComponent } from "./message-page/message-page.component";
import { MessageDetailComponent } from "./message-page/message-list/message-list.component";

export const MESSAGES_ROUTES: Routes = [
  {
    path: "",
    component: MessagePageComponent,
    children: [
      { path: ":id", component: MessageDetailComponent }
    ]
  }
];