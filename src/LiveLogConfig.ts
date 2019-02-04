import { FallbackLog } from "./FallbackLog";
import { LogFormat } from "./format/LogFormat";
import { LogLevel } from "./LogLevel";
import { PortableEnv } from "./PortableEnv";
import { StaticConfig } from "./StaticConfig";

export class LiveLogConfig {
    private static EVALUATION_INTERVAL_MS = 200;
    private levelEvaluationEnvNames: Array<string | undefined> = [];
    private level: LogLevel = LogLevel.DEFAULT_LEVEL;
    private format: LogFormat = LogFormat.DEFAULT_FORMAT;

    public constructor(levelEvaluationEnvNames: Array<string | undefined>) {
        this.levelEvaluationEnvNames = levelEvaluationEnvNames;

        this.evaluateAndSchedule();
    }

    public setLevelEvaluationEnvNames(levelEvaluationEnvNames: Array<string | undefined>) {
        this.levelEvaluationEnvNames = levelEvaluationEnvNames;
        this.evaluate(); // timer is already set
    }

    public getLevel(): LogLevel {
        return this.level;
    }

    public getFormat(): LogFormat {
        return this.format;
    }

    private evaluateAndSchedule() {
        try {
            this.evaluate();
            setTimeout(() => this.evaluateAndSchedule(), LiveLogConfig.EVALUATION_INTERVAL_MS);
        } catch (error) {
            FallbackLog.log(`Could not evaluate live log config: ${error}: ${error.stack}`);
        }
    }

    private evaluate() {
        this.format = this.evaluateFormat();
        this.level = this.evaluateLogLevel();
    }

    private evaluateFormat(): LogFormat {
        const formatStr = PortableEnv(StaticConfig.LOG_FORMAT_ENV);
        if (formatStr) {
            return LogFormat.valueOf(formatStr);
        } else {
            return LogFormat.DEFAULT_FORMAT;
        }
    }

    private evaluateLogLevel(): LogLevel {
        const primaryLevelEvaluation = this.chooseMostVerboseLevel(this.levelEvaluationEnvNames);
        if (primaryLevelEvaluation) {
            return primaryLevelEvaluation;
        }

        const leastLevelEvaluation = this.chooseMostVerboseLevel([StaticConfig.LEAST_LEVEL_ENV]);
        if (leastLevelEvaluation) {
            return leastLevelEvaluation;
        }

        return LogLevel.DEFAULT_LEVEL;
    }

    private chooseMostVerboseLevel(levelList: Array<string | undefined>): LogLevel | undefined {
        const definedLevels: LogLevel[] = levelList.filter(level => !!level).map(level => LogLevel.valueOf(level + ""));

        if (definedLevels.length === 0) {
            return undefined;
        }

        const mostVerboseLevel: LogLevel = definedLevels.reduce((theMostVerboseLevel: LogLevel, currLevel: LogLevel) =>
            LogLevel.moreVerbose(theMostVerboseLevel, currLevel),
        );
        return mostVerboseLevel;
    }
}
