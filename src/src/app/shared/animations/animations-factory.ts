import {
  trigger,
  state,
  transition,
  animate,
  style,
  AnimationTriggerMetadata,
} from '@angular/animations';

export class AnimationsFactory {
  public static expandCollapseAnimation(
    styleToModifyName: string,
    styleValueAfter: string,
    styleValueBefore: string
  ): AnimationTriggerMetadata {
    const animation = trigger('expandCollapse', [
      state('expand', style({ [styleToModifyName]: styleValueAfter })),
      state('collapse', style({ [styleToModifyName]: styleValueBefore })),
      transition('expand => collapse', [animate('0.1s ease-out')]),
      transition('collapse => expand', [animate('0.1s ease-out')]),
    ]);
    return animation;
  }
}
