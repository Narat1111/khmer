import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Thermometer, Droplets, Wind } from "lucide-react";

interface WeatherData {
  temperature: number;
  windspeed: number;
  humidity: number;
  description: string;
}

const weatherCodes: Record<number, string> = {
  0: "☀️ ច្បាស់", 1: "🌤 ស្រាលៗ", 2: "⛅ ពពកខ្លះ", 3: "☁️ ពពកច្រើន",
  45: "🌫 អ័ព្ទ", 48: "🌫 អ័ព្ទទឹកកក", 51: "🌧 ភ្លៀងតិចតួច", 53: "🌧 ភ្លៀងមធ្យម",
  55: "🌧 ភ្លៀងខ្លាំង", 61: "🌧 ភ្លៀង", 63: "🌧 ភ្លៀងមធ្យម", 65: "🌧 ភ្លៀងខ្លាំង",
  71: "❄️ ព្រិល", 73: "❄️ ព្រិលមធ្យម", 75: "❄️ ព្រិលខ្លាំង",
  95: "⛈ ព្យុះផ្គរ", 96: "⛈ ព្យុះ", 99: "⛈ ព្យុះខ្លាំង",
};

const WeatherApp: React.FC = () => {
  const { t } = useI18n();
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState("");

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
      const geoData = await geoRes.json();
      if (!geoData.results?.length) throw new Error("City not found");
      const { latitude, longitude, name } = geoData.results[0];
      setCityName(name);

      const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`);
      const wxData = await wxRes.json();
      const cw = wxData.current_weather;

      setWeather({
        temperature: cw.temperature,
        windspeed: cw.windspeed,
        humidity: wxData.hourly?.relative_humidity_2m?.[0] ?? 0,
        description: weatherCodes[cw.weathercode] ?? "មិនស្គាល់",
      });
    } catch {
      setError("រកមិនឃើញទីក្រុង");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="វាយឈ្មោះទីក្រុង (ជាអង់គ្លេស)..."
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <Button onClick={search} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {weather && (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-english">{cityName}</p>
            <p className="text-4xl font-bold font-english tabular-nums">{weather.temperature}°C</p>
            <p className="text-sm">{weather.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-accent/50 p-3">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">ខ្យល់</div>
                <div className="font-english tabular-nums text-sm">{weather.windspeed} km/h</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-accent/50 p-3">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">សំណើម</div>
                <div className="font-english tabular-nums text-sm">{weather.humidity}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
