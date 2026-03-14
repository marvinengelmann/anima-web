import { useTranslations } from "next-intl";

export function AnalyticsHeader() {
	const t = useTranslations("Analytics");

	return (
		<div className="mx-auto max-w-2xl text-center flex flex-col gap-6 mb-6">
			<h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground">
				{t("title")}
			</h2>
			<p className="text-base md:text-lg lg:text-xl font-light text-muted-foreground">
				{t("subtitle")}
			</p>
		</div>
	);
}
