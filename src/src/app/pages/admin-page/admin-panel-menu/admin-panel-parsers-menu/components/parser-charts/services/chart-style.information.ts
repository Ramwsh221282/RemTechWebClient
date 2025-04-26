export interface ChartStyleInformation {
  primaryTextColor: string;
  secondaryTextColor: string;
  surfaceBorder: string;
}

export class ChartStyleInformationFactory {
  public static createChartStyleInformation(): ChartStyleInformation {
    const documentStyle: CSSStyleDeclaration = this.getDocumentStyle();
    const primaryTextColor: string = this.getPrimaryTextColor(documentStyle);
    const secondaryTextColor: string =
      this.getSecondaryTextColor(documentStyle);
    const surfaceBorder: string = this.getSurfaceBorder(documentStyle);
    return {
      primaryTextColor: primaryTextColor,
      secondaryTextColor: secondaryTextColor,
      surfaceBorder: surfaceBorder,
    };
  }

  private static getDocumentStyle(): CSSStyleDeclaration {
    return getComputedStyle(document.documentElement);
  }

  private static getPrimaryTextColor(
    documentStyle: CSSStyleDeclaration,
  ): string {
    return documentStyle.getPropertyValue('--p-text-color');
  }

  private static getSecondaryTextColor(
    documentStyle: CSSStyleDeclaration,
  ): string {
    return documentStyle.getPropertyValue('--p-text-muted-color');
  }

  private static getSurfaceBorder(documentStyle: CSSStyleDeclaration): string {
    return documentStyle.getPropertyValue('--p-content-border-color');
  }
}
