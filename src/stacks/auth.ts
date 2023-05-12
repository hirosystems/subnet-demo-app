import { AppConfig, UserSession } from "@stacks/connect";

export const appConfig = new AppConfig(["publish_data"]);
export const userSession = new UserSession({ appConfig });
