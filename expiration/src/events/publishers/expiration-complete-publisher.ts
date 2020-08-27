import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@lcmtickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
