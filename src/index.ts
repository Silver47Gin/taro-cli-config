import { IPluginContext } from "@tarojs/service";

/**
 * 用于在命令行可以修改配置文件
 * eg.
 * taro build --type rn --config rn.output.ios=./ios/tmp/main.jsbundle
 * 将修改config中的rn output ios 字段的值为 ./ios/tmp/main.jsbundle
 */
export default (ctx: IPluginContext) => {
  ctx.onBuildStart(() => {
    const command = process.argv;
    const isSetConfig = (token: string) => token.startsWith("--config");
    while (command.length) {
      const first = command.shift();
      if (!!first && isSetConfig(first) && command.length && command[0]) {
        const [objPath, argument] = command.shift()!.split("=");

        /**
         * 不知道为什么无法直接修改ctx.initialConfig，只能修改内部属性
         */
        const [...keyPaths] = objPath.split(".");
        let now = ctx.initialConfig;
        while (keyPaths.length !== 1) {
          now = now[keyPaths.shift()!];
        }
        now[keyPaths.shift()!] = argument;
      }
    }
  });
};
