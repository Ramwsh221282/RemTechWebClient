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

  public static fadeInOutAnimation(
    styleValueAfter: number,
    styleValueBefore: number
  ) {
    const animation = trigger('fadeInOut', [
      state('fadeIn', style({ opacity: String(styleValueAfter) })),
      state('fadeOut', style({ opacity: String(styleValueBefore) })),
      transition('fadeIn => fadeOut', [animate('1s ease-out')]),
      transition('fadeOut => fadeIn', [animate('1s ease-out')]),
    ]);
    return animation;
  }
}
