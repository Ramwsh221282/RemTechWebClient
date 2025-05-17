import { StringUtils } from '../../../../../shared/utils/string-utils';

export type MailingSender = {
  id: string;
  serviceName: string;
  email: string;
  priority: number;
  status: string;
  isActive: boolean;
};

export type CreateMailingSenderDto = {
  serviceName: string;
  serviceEmail: string;
  smtpKey: string;
};

// public sealed record CreateMailingSenderRequest(string ServiceName, string ServiceEmail, string SmtpKey);

export class MailingSenderFactory {
  public static default(): MailingSender {
    return {
      id: '',
      serviceName: '',
      email: '',
      priority: 0,
      status: '',
      isActive: false,
    };
  }
}

export class CreateMailingSenderValidation {
  public static isEmailEmpty(dto: CreateMailingSenderDto): boolean {
    const email = dto.serviceEmail;
    return StringUtils.isEmptyOrWhiteSpace(email);
  }

  public static isEmailNotCompatible(dto: CreateMailingSenderDto): boolean {
    const email = dto.serviceEmail;
    return !(
      email.endsWith('gmail.com') ||
      email.endsWith('yandex.ru') ||
      email.endsWith('mail.ru')
    );
  }

  public static isPasswordEmpty(dto: CreateMailingSenderDto): boolean {
    const password = dto.smtpKey;
    return StringUtils.isEmptyOrWhiteSpace(password);
  }

  public static isServiceNameEmpty(dto: CreateMailingSenderDto): boolean {
    const serviceName = dto.serviceName;
    return StringUtils.isEmptyOrWhiteSpace(serviceName);
  }
}
