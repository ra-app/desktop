/* global Whisper, i18n, getAccountManager, $, _, textsecure, QRCode */

/* eslint-disable more/no-then */

// eslint-disable-next-line func-names
(function() {
  'use strict';

  window.Whisper = window.Whisper || {};

  const EULA = `
  Die OfficeApp (nachfolgend auch „OfA“) bietet OfficeApp Online („OfA“) Services und Software (im Folgenden auch: „Dienste“, „Produkte“, Software oder Services) für diverse Plattformen an.
  
  
  § 1 Allgemeines
  Diese Allgemeinen Geschäftsbedingungen (AGB) stellen die Grundlage für die Nutzung der OfA Services dar und regeln die vertraglichen Beziehungen zwischen Anbieter(n) und dem Kunden (im Folgenden auch Nutzer, Benutzer, Besteller oder Anwender genannt). Wenn und soweit es für Produkte gesonderte Lizenzvereinbarungen gibt (so z.B. Softwarelizenzverträge bzw. Abo-Bedingungen im OfA-Store, AGB von Drittanbietern etc.), so gelten diese ergänzend.
  
  Leistungen von OfA erfolgen ausschließlich auf der Grundlage dieser AGB in ihrer zum Zeitpunkt der Nutzung jeweils gültigen Fassung. Abweichende Regelungen haben nur dann Geltung, wenn sie zwischen allen Parteien schriftlich vereinbart worden sind. Dieses Schriftformerfordernis gilt auch für die Abbedingung der Schriftform.
  
  Die Registrierung für das OfA Kunden-Konto ist kostenlos. Es können nutzungsabhängige oder laufende Kosten entstehen, wenn und soweit OfA Services in Anspruch genommen bzw. Produkte oder Dienste lizenziert, aktiviert bzw. abonniert werden. Die Nutzung des OfA Kunden-Kontos setzt die wirksame Erteilung und Aufrechterhaltung einer gültigen Einzugsermächtigung (SEPA-Lastschriftmandat) oder PayPal Abozahlung voraus.
  
  OfA ist berechtigt, Kunden aus wichtigem Grund unverzüglich ganz oder teilweise zu sperren, z.B. wenn gegen vertragswesentliche Pflichten verstoßen wird.
  
  
  § 1a Grundsätzliches
  Anwender, die sich mit der OfA registrieren, bestätigen, dass Sie
  
  • eine etwaige Statusänderung unverzüglich schriftlich anzeigen
  • von Ihrem Unternehmen zur Registrierung bevollmächtigt sind.
  
  § 1b Schriftform, elektronischer Kommunikationsweg
  
  Mit dem Kunden gilt der elektronische Kommunikationsweg als vereinbart.
  
  
  § 2 Vertragsverhältnis, Leistungsbeschreibung
  1. Der Inhalt des Vertragsverhältnisses zwischen OfA und dem Kunden ergibt sich aus diesen AGB, den OfA Webseiten inkl. Online-Produktinformationen und OfA Produktblättern.
  
  2. Auf aktuelle Meldungen, Produktblätter, Newsletter, Kundeninformationen wird ausdrücklich hingewiesen. Sofern nicht anders angegeben, unterliegen die Bereitstellung neuer Dienste und die Erweiterung von bestehenden Services diesen AGB.
  
  3. OfA behält sich jederzeit Änderungen an Services im Zuge von Produktentwicklung und Produktpflege vor. OfA kann Inhalte/Merkmale einzelner Dienste bzw. die Dienste selbst aus wichtigem Grund vorübergehend oder auf Dauer ändern oder einstellen, soweit dies dem Kunden zumutbar ist bzw. ein für den Kunden nachvollziehbarer, im Voraus als gewichtiger Grund erkennbarer, triftiger Umstand vorliegt.
  
  Ein solcher gewichtiger Grund für eine Einschränkung, Einstellung oder Änderung der OfA Services liegt insbesondere dann vor, wenn
  
  • aufgrund von rechtlichen, insbesondere auch datenschutzrechtlichen Gründen ein Dienst oder Produkt nicht mehr aufrechterhalten werden kann, oder
  • ein von einem Kooperationspartner ursprünglich zur Verfügung gestelltes Produkt nicht oder nicht mehr verfügbar ist, oder
  • sich mit der Zurverfügungstellung von Diensten oder Produkten im Zusammenhang mit der (versuchten) Aufrechterhaltung der Verfügbarkeit unüberwindliche technische Schwierigkeiten ergeben, oder
  • die Zurverfügungstellung von Diensten oder Produkten und die Aufrechterhaltung der Verfügbarkeit derselben aus betrieblichen, unternehmerischen Gründen nicht mehr sinnvoll erscheinen.
  
  OfA wird etwaige Änderungen per E-Mail, in der Software oder auch über Webinformationen/ Webseiten mitteilen. Eine Benachrichtigung kann auch auf anderem Wege erfolgen. Das Vertragsverhältnis wird dann mit den neuen Bedingungen/Merkmalen fortgesetzt.
  
  
  § 3 Zustandekommen des Vertrages
  1. Der Vertrag zwischen OfA und dem Kunden kommt nach Maßgabe von Ziffer 2. dadurch zustande, dass der Kunde sich registriert, sein Einverständnis in die vorliegenden AGB erklärt und der OfA Datenschutzerklärung zustimmt (Angebot) und die Registrierung durch OfA schriftlich, per E-Mail oder sonst elektronisch bestätigt wird bzw. bei einzelnen Produkten/Diensten durch Lizenzierung von entsprechenden Produkten gemäß Ziffer 2 im OfA Store (Annahme).
  
  
  § 4 Pflichten und Obliegenheiten des Kunden
  1. Der Kunde ist für die richtige Eingabe seiner Daten bei Nutzung der OfA Services verantwortlich und muss wahrheitsgemäße, genaue, aktuelle und vollständige Angaben zu seiner Person machen (Registrierungsdaten) und diese regelmäßig aktualisieren. Falls der Kunde hiergegen verstößt, bzw. falls OfA dies annehmen sollte, insbes. dass Registrierungsdaten nicht aktuell bzw. unwahr oder unvollständig sind, ist OfA berechtigt, das Online-Konto des Kunden vorübergehend oder auf Dauer ganz oder teilweise zu sperren bzw. zu löschen und den Kunden von jeglicher Nutzung einzelner oder sämtlicher Services gegenwärtig und in Zukunft auszuschließen. Das gleiche gilt bei erheblichen Verstößen gegen die dem Kunden obliegenden Pflichten sowie bei begründeten erheblichen Verdachtsmomenten für eine Pflichtverletzung durch den Kunden.
  
  2. Nach der Registrierung werden dem Kunden OfA Zugangsdaten übermittelt. Zugangsdaten, insb. Passwörter (im Folgenden auch RMO OfA angsdaten, Kennwörter oder Chiffren genannt), d.h. alle Buchstaben- und/oder Zahlenfolgen, welche dazu bestimmt sind, die Nutzung durch unberechtigte Personen auszuschließen, dürfen nicht an Dritte weitergegeben werden.
  
  OfA Zugangsdaten sind vor dem Zugriff durch Dritte geschützt aufzubewahren und müssen zur Sicherheit in regelmäßigen Abständen geändert werden. Soweit Anlass zu der Vermutung besteht, dass unberechtigte Personen von den OfA Zugangsdaten Kenntnis erlangt haben, hat der Kunde Kunden- bzw. Benutzer-Passwörter unverzüglich zu ändern und OfA schriftlich zu informieren.
  Der Kunde hat zudem sicherzustellen, dass bei Nutzung von OfA Diensten über den zentralen Internetzugang des lokalen Netzwerkes des Kunden dieses lokale Netzwerk gegen das Eindringen unberechtigter Personen geschützt ist.
  
  Der Kunde darf Zugangsdaten und Kennwörter in digitalen Medien nur in verschlüsselter (dem aktuellen Stand der Technik entsprechender) Form speichern oder übermitteln. Bei mehrmaliger Falscheingabe von Zugangsdaten kann dies zu einer Sperrung der Online-Kontos oder der Nutzungsmöglichkeit, für die das Kennwort gilt, führen.
  
  3. Der Kunde trägt für alle Handlungen, die unter Verwendung seiner OfA Zugangsdaten in Verbindung mit seinem OfA Online-Konto vorgenommen werden, die Verantwortung. Der Kunde ist verpflichtet, OfA unverzüglich über jede missbräuchliche Benutzung der OfA Zugangsdaten und/oder des Online-Kontos sowie über jegliche sonstige Verletzung von kundenbezogenen Sicherheitsvorschriften zu unterrichten.
  
  Der Kunde muss zudem sicherstellen, dass nach jeder Nutzung eine Abmeldung vom Online-Konto erfolgt.
  
  4. OfA Software und Services werden laufend aktualisiert. Der Kunde wird über Updates informiert und kann entscheiden, ob er diese ausführen möchte oder nicht.
  
  Die Installation aktueller Updates ist Voraussetzung für den Betrieb neuester Funktionalitäten und der Funktionalität der OfA Services insgesamt, derer Betrieb nicht oder nur eingeschränkt gegeben ist, wenn Update-Installationen unterbleiben.
  
  5. Der Kunde hat die Pflicht, seine Daten regelmäßig auf eigenen Medien zu sichern.
  
  6. Der Kunde ist für die Inhalte, welche über sein Online-Konto eingestellt oder verbreitet werden, verantwortlich, insbesondere für deren Rechtmäßigkeit. Die Verantwortung für sämtliche Medien und Inhalte, d.h. Informationen, Daten, Texte, Software, Fotos, Grafiken, Videos, Nachrichten oder sonstige Materialien, die übermittelt werden, liegt ausschließlich beim Kunden, d.h. beim Nutzer und Verwender.
  Der Kunde darf keine Inhalte versenden, die schädlichen Code, Software-Viren, Spam- oder Werbe-Code bzw. andere Informationen, Dateien oder Programme enthalten, die die Funktion von Soft- oder Hardware oder von Telekommunikationsvorrichtungen unterbrechen, zerstören und/oder einschränken können. Der Kunde darf auch nicht in die den OfA Diensten zugrundeliegenden Server oder Netzwerke eingreifen oder diese unterbrechen.
  Der Kunde darf OfA Dienste nicht als Wiederverkäufer nutzen.
  
  7. Der Kunde wird ausdrücklich darauf hingewiesen, dass er für die Einhaltung der berufs- und standesrechtlichen wie auch der allgemeinen Vorschriften des Strafgesetzbuches, des Datenschutzrechtes und der Vorschriften zum Schutz von Persönlichkeitsrechten im Rahmen der Nutzung der OfA Dienste verantwortlich ist.
  
  8. Der Kunde wird explizit darauf hingewiesen, dass Informationen über Änderungen /Verbesserungen /Einstellungen an bzw. von Produkten- bzw. Diensten regelmäßig über die OfA-Webseiten publiziert werden. Der Kunde hat sich regelmäßig über das insoweit auf der Webseite publizierte Leistungsangebot zu informieren (siehe insoweit auch § 2 dieser AGB).
  
  9. Soweit spezielle Systemvoraussetzungen für die Nutzung von OfA-Diensten oder Produkten genannt sind, so hat der Kunde sicherzustellen, dass diese durch sein System erfüllt werden.
  
  10. Der Kunde stellt OfA von jeglichen Ansprüchen Dritter, denen aufgrund der Verletzung von Bestimmungen in diesen AGB ein Schaden entstanden ist, frei. OfA behält sich vor, bei Verstoß gegen diese AGB das Online-Konto des Kunden zu sperren und ggf. zu löschen, sowie auch Inhalte des Kunden auf OfA Servern nicht mehr weiter allgemein zugänglich zu machen bzw. zu löschen.
  
  
  § 5 Datenschutz
  1. OfA weist den Kunden darauf hin, dass die im Rahmen des Vertragsschlusses aufgenommenen Daten gemäß dem Bundesdatenschutzgesetz (BDSG) und der ab 25.05.2018 geltenden EU-Datenschutzgrundverordnung (DS-GVO) sowie dem Telemediengesetz (TMG) von RMO zur Erfüllung der Verpflichtungen aus dem Vertrag erhoben, verarbeitet und genutzt werden.
  
  Dies gilt insbesondere für die personenbezogenen Daten des Kunden, d.h. seine Kontaktinformationen, einschließlich Namen, Telefon- und Telefaxnummern sowie E-Mail Adressen. Personenbezogene Kunden- und Abrechnungsdaten können im Rahmen der bestehenden Geschäftsbeziehung verarbeitet und genutzt werden.
  
  Die vorgenannten Daten (mit Ausnahme der OfA Zugangsdaten) können zum Zweck von Bonitätsprüfungen auch an Beauftragte und gemäß Art. 28 DS-GVO sorgfältig ausgesuchte Partner von RAM übermittelt werden. Eine Weitergabe personenbezogener Kundendaten durch OfA an Dritte kann nur erfolgen, wenn und soweit eine durch Gesetz begründete Rechtspflicht hierzu besteht.
  
  2. Der Kunde wird darauf hingewiesen, dass die im Zuge der Nutzung der OfA Recherchen erlangten Daten nur im Rahmen einer bereits bestehenden Kundenbeziehung (z.B. Wiederaufnahme des Kontaktes mit unbekannt verzogenen Geschäftspartnern) oder zur Durchsetzung von Rechtsansprüchen (vorgerichtliche und gerichtliche Korrespondenz) zu verwenden sind (berechtigtes Interesse) und diese zudem weder zum Zwecke der Markt- oder Meinungsforschung genutzt, noch an Dritte weitergegeben werden dürfen.
  
  3. Es gelten ergänzend die allgemeine OfA Datenschutzerklärung sowie etwaige produktbezogene Bestimmungen, die bei der Nutzung angezeigt werden können.
  
  
  § 5a Datenschutz, Dateien und Daten – Schnittstellen zu Drittanbietern
  Einige OfA Produkte können Schnittstellen zu Anwendungen und Produkten von Drittanbietern bieten. Für die Nutzung dieser Anwendungen der Drittanbieter ist es erforderlich, dass der Kunde sich dort anmeldet und die dortigen Nutzungs-, Geschäftsbedingungen akzeptiert. OfA macht darauf aufmerksam, dass diese Anwendungen von Drittanbietern möglicherweise abweichende Regelungen für die Nutzung von Kunden-Daten und Kunden-Dateien getroffen haben. Bei der dortigen Registrierung sollte der Kunde diese Bedingungen sowie die Datenschutzrichtlinien prüfen und jeweils über die Nutzung der bereitgestellten Funktionalitäten entscheiden. OfA weist ferner bei der erstmaligen Aktivierung von OfA Software bzw. Applikationen darauf hin, dass Produkte von Drittanbietern genutzt werden (können). Der Kunde hat jederzeit die Möglichkeit, die Nutzung der Schnittstelle/n zu beenden, wobei dann der Funktionsumfang der OfA Software eingeschränkt sein kann.
  
  
  § 6 Haftungsbeschränkung
  1. OfA haftet nicht für Schäden, die kausal aus einer vom Kunden zu vertretenden Pflichtverletzung herrühren, soweit diese bei pflichtgemäßem Handeln des Kunden nicht eingetreten wären. Zudem wird der Kunde darauf hingewiesen, dass die Datenkommunikation über das Internet nach dem derzeitigen Stand der Technik nicht gänzlich fehlerfrei und/oder jederzeit verfügbar gewährleistet werden kann. RMO haftet daher weder OfA die ständige und ununterbrochene Verfügbarkeit des Onlinesystems noch für etwaige technische und elektronische Fehler der RMO Software, Applikationen und Services.
  
  OfA wird sich bestmöglich bemühen, die OfA Services mit so wenigen Unterbrechungen wie möglich bereitzustellen, kann aber nicht zu 100% sicherstellen, dass die Produkte und Dienste immer ohne Unterbrechungen, Verzögerungen oder sonstige Mängel funktionieren. Dies liegt daran, dass die Produkte über (öffentliche) Internetleitungen übertragen werden können und daher Stromausfälle oder Internetdienstunterbrechungen möglich sind, es z.B. so zu Ausfällen kommen kann, z.B. Datenpaketverluste und Verzögerungen, die die Qualität der Kommunikation beeinträchtigen können.
  
  Generell gilt: Eine etwaige Haftung von OfA (Ansprüche des Kunden auf Schadensersatz oder Ersatz vergeblicher Aufwendungen), sofern eine solche aus welchem Rechtsgrund auch immer gegeben sein sollte, richtet sich nach den Bestimmungen dieses Paragrafen.
  
  2. Für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer fahrlässigen Pflichtverletzung des Dienstleisters oder einer vorsätzlichen oder fahrlässigen Pflichtverletzung eines gesetzlichen Vertreters oder Erfüllungsgehilfen des Dienstleisters beruhen, haftet OfA unbeschränkt.
  
  3. Bei den übrigen Haftungsansprüchen haftet OfA unbeschränkt nur bei nicht Vorhandensein der garantierten Beschaffenheit sowie für Vorsatz und grobe Fahrlässigkeit auch seiner gesetzlichen Vertreter und leitenden Angestellten.
  
  OfA haftet für das Verschulden sonstiger Erfüllungsgehilfen nur im Umfang der Haftung für leichte Fahrlässigkeit nach Abs. 4.
  
  4. Für leichte Fahrlässigkeit haftet OfA nur, sofern eine Pflicht verletzt wird, deren Einhaltung für die Erreichung des Vertragszwecks von besonderer Bedeutung ist (Kardinalpflicht). Bei der leicht fahrlässigen Verletzung einer Kardinalpflicht ist die Haftung beschränkt auf den vorhersehbaren, vertragstypischen Schaden.
  
  5. Die Haftung für Datenverlust wird auf den typischen Wiederherstellungsaufwand beschränkt, der bei regelmäßiger und gefahrenentsprechender Anfertigung von Sicherungskopien eingetreten wäre. Es sei denn, es liegt eine der Voraussetzungen nach Abs. 2 oder Abs. 3 vor.
  
  6. Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
  
  7. Die vertraglichen Haftungsansprüche verjähren nach einem Jahr.
  
  8. Der Kunde ist sich bei Verwendung einer als „Betaversion“ gekennzeichneten Software oder eines Dienstes/Services darüber bewusst, dass die Software bzw. der Dienst/Service noch fehlerhaft sein kann und Beschädigungen am System unter Umständen möglich sein können.
  
  Der Kunde ist damit einverstanden, im Falle solcher Beschädigungen keine direkten oder indirekten Ansprüche an OfA zu stellen.
  
  OfA versichert, jeden vom Kunden benannten Softwarefehler, der Dringlichkeit und den technischen Gegebenheiten entsprechend, schnellstmöglich beheben zu wollen.
  Der Kunde stellt sicher, dass durch den Einsatz einer als Betaversion gekennzeichneten Software bzw. eines Dienstes/Services keine Systeme betroffen werden können, die in irgendeiner Form sicherheitsrelevant sind.
  
  
  § 7 Haftung des Kunden, Folgen von Obliegenheitsverletzungen
  Bei durch ihn zu vertretenden Verletzungen von Rechten Dritter haftet der Kunde gegenüber diesen Dritten selbst und unmittelbar. Bei begründeten Ansprüchen Dritter ist der Kunde verpflichtet, OfA freizustellen, wobei etwas Anderes nur dann gilt, soweit der Kunde nachweist, dass er die schadensursächliche Pflichtverletzung nicht zu vertreten hat.
  
  
  § 8 Zahlungspflichten, Abrechnung, Verwaltung, elektronische Rechnung
  Der Kunde erhält eine monatliche Rechnung, in der ausdrücklich auf eine Zahlungsfrist hingewiesen wird. Die Rechnung erfolgt in elektronischer Form und wird monatlich im Kunden-Konto des OfA Online-Kontos zur Ansicht und zum Download bereitgestellt. Im Falle des Zahlungsverzuges gelten die gesetzlichen Regeln. Ein Aufrechnungsrecht steht dem Kunden nur zu, soweit seine Gegenforderung rechtskräftig festgestellt, unbestritten oder anerkannt ist. Das Zurückbehaltungsrecht, insbesondere die Einrede des nicht erfüllten Vertrages, bleibt unberührt. OfA kann – unbeschadet anderer Rechte – das OfA Online-Konto eines Kunden aufgrund erheblicher Pflichtverletzungen sperren, z.B. im Falle eines Zahlungsverzuges in Höhe von mindestens 50,- €. Im Falle einer Sperrung bestehen die Zahlungspflicht sowie die Geltendmachung weiterer Ansprüche wegen Zahlungsverzuges fort.
  
  
  § 9 Kündigung, Laufzeit
  1. Das Vertragsverhältnis kann vom Kunden jederzeit, jedoch nicht vor Ablauf der Kündigungsfrist eines von ihm abonnierten Produktes, mit sofortiger Wirkung schriftlich gekündigt werden. (Mindest-)Laufzeiten, Kündigungsfristen von Produkten und Services sind im OfA Online Konto, dort im OfA-Store beim jeweiligen Dienst bzw. Produkt genannt und werden durch Aktivierung eines Abos bzw. einer Lizenz vom Kunden akzeptiert im Rahmen des Bestellvorganges. Sofern nicht anders im OfA Store technisch realisiert, hat eine Kündigung vom Kunden in Schriftform zu erfolgen.
  Von OfA kann das Vertragsverhältnis mit einer Frist von 2 Wochen zum Ende eines Kalendermonats schriftlich gekündigt werden.
  
  2. Das Vertragsverhältnis kann zudem von OfA fristlos aus wichtigem Grund außerordentlich gekündigt werden, so insbesondere, wenn der Kunde mit der Zahlung für zwei aufeinander folgende Monate bzw. mit einem nicht unerheblichen Teil gegenüber OfA in Verzug ist oder OfA das Festhalten an dem Vertragsverhältnis nicht weiter zugemutet werden kann, z. B. weil die Geschäftsgrundlage wegefallen ist oder das vertragliche Vertrauensverhältnis nicht mehr besteht.
  
  3. Sofern nichts Anderes vereinbart, ist mit Beendigung des Vertragsverhältnisses der Kunde verpflichtet, die OfA Software unverzüglich von seinen Systemen zu entfernen.
  
  
  § 10 Auftragsverarbeitung, Geltung von weiteren AGB und besondere Bestimmungen
  1. Der Kunde ist im Rahmen der Auftragsverarbeitung in Bezug auf die über OfA Dienste angefragten bzw. übermittelten Daten und Datensätze für die Einhaltung sowohl der EU-Datenschutzgrundverordnung (DS-GVO) als auch der anderen Bestimmungen über den Datenschutz allein verantwortlich. Er verpflichtet sich, OfA unter Angabe von Kontaktdaten (Name, Organisation, Telefonnummer etc.) die Personen schriftlich mitzuteilen, die gegenüber OfA in Bezug auf die Auftragsdatenbearbeitung weisungsberechtigt sind oder als Ansprechpartner fungieren.
  
  2. Der Kunde ist ferner verpflichtet, den Auftragnehmer über bekannt gewordene Fehler oder Unregelmäßigkeiten bei der Auftragsdatenverarbeitung unverzüglich und vollständig zu unterrichten.
  
  3. OfA verpflichtet sich, die an sie übermittelten Daten zweckbestimmt und nur im Rahmen der Weisungen (zu Weisung, Weisungsberechtigung s. o.) des Kunden (d. h. allein im Rahmen der Nutzung der OfA Dienste) zu erheben, zu verarbeiten und zu nutzen. OfA trifft die erforderlichen technischen und organisatorischen Maßnahmen im Sinne des Art. 32 DS-GVO, um die Einhaltung von Datenschutzvorschriften zu gewährleisten.
  
  OfA unterrichtet den Kunden umgehend bei schwerwiegenden Störungen des Betriebsablaufs, bei Verdacht auf Datenschutzverletzungen oder andere Unregelmäßigkeiten bei der Verarbeitung der Daten des Kunden.
  
  4. Auf schriftliche Anfrage des Kunden hin wird OfA diesem jene Informationen bereitstellen, die der Kunde zur Erfüllung seiner datenschutzrechtlichen Verpflichtungen benötigt.
  
  5. Der Kunde ist damit einverstanden, dass OfA zur Erfüllung der vertraglich vereinbarten Leistungen verbundene Unternehmen von OfA sowie weitere Dritte zur Leistungserfüllung heranziehen kann bzw. Unternehmen mit Leistungen unterbeauftragen kann (Subunternehmer).
  Wenn und soweit Subunternehmer eingeschaltet werden, so werden die vertraglichen Vereinbarungen zwischen OfA und dem Subunternehmer so gestaltet, dass sie den Anforderungen zu Vertraulichkeit, Datenschutz und Datensicherheit zwischen den Vertragspartnern dieses Vertrages entsprechen.
  
  § 11 Änderungen von AGB, Leistungsbeschreibungen, Preise, Preiserhöhungen, Leistungen von Drittanbietern
  1. Soweit wesentliche Bestimmungen des geschlossenen Vertrages nicht tangiert werden und es zur Anpassung an aktuelle Entwicklungen erforderlich ist, welche bei Vertragsschluss nicht vorhersehbar waren und deren Nichtberücksichtigung die Ausgewogenheit des Vertragsverhältnisses merklich beeinträchtigen würde, ist eine Änderung dieser AGB zulässig.
  
  Die AGB können auch angepasst, ergänzt oder sonst verändert werden, soweit dies zur Beseitigung von etwaigen Schwierigkeiten bei der Durchführung des Vertrages, z.B. aufgrund von nach Vertragsschluss entstandenen Regelungslücken erforderlich ist, so z.B. wenn sich die Rechtsprechung ändert und eine oder mehrere Klauseln dieser AGB hiervon betroffen sind.
  
  2. Auch können die z. B. in Produktblättern enthaltenen Leistungsbeschreibungen aus wichtigem Grund geändert werden, soweit der Kunde hierdurch gegenüber der bei Vertragsschluss einbezogenen Leistungsbeschreibung objektiv nicht schlechter gestellt wird.
  
  3. Für die Inanspruchnahme der einzelnen Leistungen gelten die genannten Preise im Online-Konto, OfA-Store bzw. die innerhalb des Produktes bzw. Dienstes angegebenen Preise. Alle genannten Preise für die einzelnen kostenpflichtigen Inhalte bzw. Dienste sind Netto-Preise und verstehen sich zzgl. Umsatzsteuer (derzeit 19%). Entstandene Kosten werden monatlich zusammengefasst abgerechnet und auf Grundlage der erteilten Einzugsermächtigung eingezogen. Wird der Rechnungsbetrag trotz erteilter Einzugsermächtigung aus Gründen zurückgebucht, die OfA nicht zu vertreten hat, ist OfA  berechtigt, eine Pauschale für die entstandenen Bankgebühren in Höhe von bis zu 10,00 € zu erheben.“
  
  4. Vereinbarte Preise, insb. Preise von laufenden Abos, können zum Ausgleich von gestiegenen Kosten erhöht werden, so z.B. auch, wenn die Umsatzsteuer erhöht wird, eine Preiserhöhung von der Bundesnetzagentur aufgrund von Regulierungsvorschriften verbindlich gefordert wird oder sich die Preise unserer Dienstleister erhöhen.
  
  Preisänderungen/Preiserhöhungen werden dem Kunden von OfA mit einer Frist von einem Monat zum Monatsende schriftlich bekannt gegeben.
  
  Die Änderungen gelten als vom Kunden genehmigt, wenn der Kunde nicht schriftlich innerhalb von einem Monat nach Bekanntgabe der Änderungen Widerspruch erhebt. Auf diese Folge wird der Kunde von OfA bei der Änderung ausdrücklich hingewiesen. Zur Fristwahrung genügt die fristgerechte Absendung des Widerspruches.
  
  5. Werden Leistungen in Anspruch genommen, die von Drittanbietern erbracht werden, so gelten die Allgemeinen Geschäftsbedingungen dieser Anbieter ergänzend. Eine Liste der jeweils aktuell gültigen Bedingungen wird auf den OfA Webseiten veröffentlicht.
  
  
  § 12 Probe-, Test- und Basisversionen von Software bzw. Diensten
  OfA kann Software, Services und Applikationen mit kostenloser, eingeschränkter Basisfunktionalität, z.B. auch für einen bestimmten Probezeitraum, anbieten. Über Art und Umfang der Funktionalitäten wird OfA jeweils informieren. OfA ist berechtigt, mit Ablauf des Probezeitraums Daten und Datenbestände des Kunden auf OfA-Servern zu löschen.
  
  § 13 Sonstiges
  1. Es gilt das Recht der Bundesrepublik Deutschland. Die Geltung des UN-Kaufrechts wird ausgeschlossen.
  
  2. Ausschließlicher Gerichtsstand ist Berlin. Dies gilt auch, wenn der Kunde keinen allgemeinen Gerichtsstand im Inland hat, ein Kunde nach Vertragsabschluss seinen Wohnsitz oder gewöhnlichen Aufenthalt in das Ausland verlegt hat oder sein Wohnsitz oder gewöhnlicher Aufenthaltsort zum Zeitpunkt der Klageerhebung unbekannt ist.
  
  3. Rechte und Pflichten aus diesem Vertrag können nur nach vorheriger schriftlicher Zustimmung von OfA auf Dritte übertragen werden.`;
  const Steps = {
    ACCEPT_EULA: 1,
    SETUP_TYPE: 2,
    SETUP_PHONE: 3,
    SETUP_COMPANY_PROFILE: 4,
    SETUP_COMPANY_BANK: 5,
    SETUP_USER_PROFILE: 6,
    SETUP_CONTACT_IMPORT: 7,
    SETUP_BRANCHEN: 8,
    SETUP_PHONESLIST: 9,
  };

  let Tmp = {};
  Whisper.InstallView = Whisper.View.extend({
    templateName: 'install-flow-template',
    className: 'main full-screen-flow',
    events: {
      'change #accept-eula-check': 'onChangeAcceptEula',
      'click #continue-eula': 'onContinueEula',
      'click #continue-setup-company': 'onCompanySetup',
      'click #continue-setup-admin': 'onAdminSetup',
      'keyup #admin-signup-code, #admin-company-code':
        'activateButtonRegisterAdminClient',
      // 'validation #phone-number-value': 'onNumberValidation',
      'click #request-verify-call': 'onRequestVerifyCall',
      'click #request-verify-sms': 'onRequestVerifySMS',
      // 'change #phone-verification-code': 'onChangeVerifyCode',
      'click #verify-phone-code': 'onVerifyPhone',
      'click #phone-number-country': 'onOpenSelectPhoneList',
      'keyup #search-phones': 'searchPhones',
      'click #phone-list p': 'onSelectPhone',
      'keyup #phone-number-value': 'activateButtonVerifyCall',
      'keyup #phone-verification-code': 'activateButtonVerifyCode',
      'click #company-profile-done': 'onCompanyProfileDone',
      'click #branch-select': 'onOpenSelectBranch',
      'keyup #search-branch': 'searchBranch',
      'click #branch-list > p': 'onSelectBranch',
      'keyup  #tax-number-input, #tax-id-input, #company-register-id-input, #imprint-input, #branch-select':
        'activateButtonCompanyInfo',
      'keyup #user-name-input, #company-name-input':
        'activateButtonProfileDetails',
      'keyup #bank-iban-input, #bank-bic-input': 'activateButtonBankDetails',
      'click #user-profile-done': 'onUserProfileDone',
      'click #bank-details-done': 'onBankDetailsDone',
      'click #bank-details-skip': 'onBankDetailsSkip',
      'click #contact-import-done': 'onContactImportDone',
      'click #contact-import-skip': 'onContactImportSkip',
      'click #uploadAvatar': 'onUploadAvatar',
      'change #inputAvatar': 'onChoseAvatar',
      'click #uploadCompanyAvatar': 'onUploadCompanyAvatar',
      'change #inputCompanyAvatar': 'onChoseCompanyAvatar',
      'click #uploadDocuments': 'onuploadDocuments',
      'change #inputDocument': 'onChoseDocument',
      'click #clear-country': 'onClearCountry',
      'click #clear-branchen': 'onClearBranchen',
      'click #contact-import-file-select': 'onChooseContactsFile',
      'change #contact-import-file-input': 'onChoseContactsFile',
    },
    initialize(options = {}) {
      this.accountManager = getAccountManager();

      const eulaAccepted = textsecure.storage.get('eulaAccepted', false);
      this.setupType = textsecure.storage.get('setupType', null);
      const number = textsecure.storage.user.getNumber();
      if (!eulaAccepted) {
        this.selectStep(Steps.ACCEPT_EULA);
      } else if (!this.setupType) {
        this.selectStep(Steps.SETUP_TYPE);
      } else if (this.setupType) {
        if (!number) this.selectStep(Steps.SETUP_PHONE);
        else
          this.selectStep(
            this.setupType === 'admin'
              ? Steps.SETUP_USER_PROFILE
              : Steps.SETUP_COMPANY_PROFILE
          );
      }
    },
    selectStep(step) {
      if (this.step === Steps.ACCEPT_EULA) {
        this.$('.eula-text').off('scroll');
      }

      this.step = step;
      if (this.setupType == 'admin') {
        this.setupTypeAdmin = true;
      } else if (this.setupType == 'company') {
        this.setupTypeCompany = true;
      }
      this.render();

      if (this.step === Steps.SETUP_COMPANY_PROFILE) {
        const info = textsecure.storage.get('companySetupInfo', null);
        if (info) {
          this.$('#tax-number-input').val(info.taxNumber);
          // this.$('#tax-id-input').val(info.taxID);
          this.$('#company-register-id-input').val(info.registerID);
          this.$('#imprint-input').val(info.imprint);
          this.$('#branch-select').val(info.branch);
        }
        this.activateButtonCompanyInfo();
      }

      if ( this.step === Steps.SETUP_BRANCHEN ){
        document.getElementById('search-branch').focus()
      }

      if ( this.step === Steps.SETUP_PHONESLIST ){
        document.getElementById('search-phones').focus()
      }

      if (this.step === Steps.SETUP_USER_PROFILE) {
        const info = textsecure.storage.get('userSetupInfo', null);
        if (info) {
          this.$('#user-name-input').val(info.name);
          this.$('#company-name-input').val(info.companyName);
        }
        this.activateButtonProfileDetails();
      }

      if (this.step === Steps.SETUP_COMPANY_BANK) {
        const info = textsecure.storage.get('bankSetupInfo', null);
        if (info) {
          this.$('#bank-iban-input').val(info.iban);
          this.$('#bank-bic-input').val(info.bic);
        }
        this.activateButtonBankDetails();
      }

      // if (this.step === Steps.ACCEPT_EULA) {
      //   this.$('.eula-text').on(
      //     'scroll',
      //     _.debounce(this.onEulaScroll.bind(this), 100)
      //   );
      // }
      if (this.step === Steps.SETUP_PHONE) {
        const number = textsecure.storage.user.getNumber();
        if (number) this.$('#phone-number-value').val(number);
        // this.phoneView = new Whisper.PhoneInputView({
        //   el: this.$('#phone-number-input'),
        // });
      } else {
        if (this.phoneView) this.phoneView.remove();
        this.phoneView = null;
      }
    },
    async onSetupCompleted() {
      try {
        /*
        const phone = textsecure.storage.user.getNumber();
        const user = textsecure.storage.get('userSetupInfo', null);
        */

        if (this.setupType === 'company') {
          const company = textsecure.storage.get('companySetupInfo', null);
          const userSetupInfo = textsecure.storage.get('userSetupInfo', null);
          const bank = textsecure.storage.get('bankSetupInfo', null);
          const result = await createCompany({
            name: userSetupInfo.companyName,
            business: company.branch,
            tax_number: company.taxNumber,
            // tax_id: company.taxID,
            commarcial_register: company.registerID,
            iban: bank ? bank.iban : null,
            bic: bank ? bank.bic : null,
          });
          textsecure.storage.put('companyNumber', result.info.company_number);
          const test = await updateAdmin(
            result.info.company_number,
            userSetupInfo.name || ''
          );
          const avatarInfo = await textsecure.storage.get('avatarInfo', null);
          const avatarCompanyInfo = await textsecure.storage.get(
            'dataCompanyAvatar',
            null
          );
          if (avatarInfo) {
            const dataAvatar = {
              data: avatarInfo.userAvatar,
              type: avatarInfo.userAvatarType,
            };
            await setAdminAvatar(result.info.company_number, dataAvatar);
          }
          if (avatarCompanyInfo) {
            const dataCompanyAvatar = {
              data: avatarCompanyInfo.companyAvatar,
              type: avatarCompanyInfo.companyAvatarType,
            };
            await setCompanyAvatar(
              result.info.company_number,
              dataCompanyAvatar
            );
          }
          // do pupdate avatar
          if (this.contactsData) {
            await updateContact(result.info.company_number, this.contactsData);
          }
          await ensureCompanyConversation(result.info.company_number);
        } else if (this.setupType === 'admin') {
          const codeCompany = textsecure.storage.get('codeCompany', false);
          const userSetupInfo = textsecure.storage.get('userSetupInfo', null);
          const avatarInfo = await textsecure.storage.get('avatarInfo', null);
          const role = await textsecure.storage.get('role', null);
          // const client_uuid = await textsecure.storage.get('client_uuid', null);

          if (avatarInfo && role) {
            const dataAvatar = {
              data: avatarInfo.userAvatar,
              type: avatarInfo.userAvatarType,
            };
            if (role === 'user') {
              await setClientAvatar(dataAvatar);
            } else {
              await setAdminAvatar(codeCompany, dataAvatar);
            }
          }
          const data = {
            name: userSetupInfo.name,
          };
          await updateClient(data);
          await ensureCompanyConversation(codeCompany);
        }
        await Promise.all([
          textsecure.storage.put('registerDone', true),
          textsecure.storage.remove('companySetupInfo'),
          textsecure.storage.remove('userSetupInfo'),
          textsecure.storage.remove('bankSetupInfo'),
          textsecure.storage.remove('setupType'),
          textsecure.storage.remove('codeCompany'),
        ]);
        window.removeSetupMenuItems();
        this.$el.trigger('openInbox');
      } catch (err) {
        console.error(err);
      }
    },
    onChooseContactsFile(e) {
      if (e.target.tagName === 'INPUT') return;
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      this.$('#contact-import-file-input').click();
    },
    async onChoseContactsFile() {
      const input = this.$('#contact-import-file-input');
      const files = input.get(0).files;
      let file = files[0];
      this.$('#contact-import-file-error').text('');
      if (file) {
        try {
          const xml = await readFileAsText(file);
          console.log(xml);
          checkValidXML(xml);
          this.contactsData = xml;
          this.contactsData = {
            contact_data: this.contactsData.toString().replace('\n', ''),
          };
        } catch (err) {
          // TODO: show invalid xml error
          console.error(err);
          input.val('');
          this.$('#contact-import-file-error').text(i18n('invalidXML'));
          file = null;
        }
      }
      if (!file) this.contactsData = null;
      this.$('#contact-import-done').toggleClass('disabled', !file);
      this.$('#contact-import-file-name').text(
        file ? file.path || file.name : i18n('noFileChosen')
      );
      console.log('Import file chose', files);
    },
    onContactImportDone() {
      if (this.$('#contact-import-done').is('.disabled')) return;
      this.onSetupCompleted();
    },
    onContactImportSkip() {
      this.onSetupCompleted();
    },
    async onCompanyProfileDone() {
      this.$('#company-profile-done').html(`<div class='container'>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                              </div>`)
      const company = {
        taxNumber: this.$('#tax-number-input').val(),
        // taxID: this.$('#tax-id-input').val(),
        registerID: this.$('#company-register-id-input').val(),
        imprint: this.$('#imprint-input').val(),
        branch: this.$('#branch-select').val(),
      };
      await textsecure.storage.put('companySetupInfo', company);
      this.$('#company-profile-done').html(i18n('continueButton'))
      this.selectStep(Steps.SETUP_USER_PROFILE);
    },
    async onUserProfileDone() {
      const profile = {
        name: this.$('#user-name-input').val(),
        companyName: this.$('#company-name-input').val(),
      };
      await textsecure.storage.put('userSetupInfo', profile);
      this.selectStep(
        this.setupType === 'admin'
          ? Steps.SETUP_CONTACT_IMPORT
          : Steps.SETUP_COMPANY_BANK
      );
    },
    async onBankDetailsDone() {
      const bank = {
        iban: this.$('#bank-iban-input').val(),
        bic: this.$('#bank-bic-input').val(),
      };
      await textsecure.storage.put('bankSetupInfo', bank);
      this.selectStep(Steps.SETUP_CONTACT_IMPORT);
    },
    async onBankDetailsSkip() {
      await textsecure.storage.remove('bankSetupInfo');
      this.selectStep(Steps.SETUP_CONTACT_IMPORT);
    },
    onClearCountry() {
      this.$('#search-phones').val('');
      const countries = this.$('.pCountry');
      for (let i = 0; i < countries.length; i++) {
        if (countries[i].style.display === 'none') {
          countries[i].style.display = 'block';
        }
      }
    },
    onClearBranchen() {
      this.$('#search-branch').val('');
      const branches = this.$('#branch-list p');
      for (let i = 0; i < branches.length; i++) {
        if (branches[i].style.display === 'none') {
          branches[i].style.display = 'block';
        }
      }
    },
    validateNumber() {
      const input = this.$('input.number');
      const dialCode = this.$('#dialCode').text();
      const number = dialCode + input.val();
      const regionCode = this.$('#countryCode')
        .text()
        .toLowerCase();

      const parsedNumber = libphonenumber.util.parseNumber(number, regionCode);
      if (parsedNumber.isValidNumber) {
        this.$('.number-container').removeClass('invalid');
        this.$('.number-container').addClass('valid');
      } else {
        this.$('.number-container').removeClass('valid');
      }
      input.trigger('validation');

      return parsedNumber.e164;
    },
    onRequestVerifyCall() {
      const number = this.validateNumber();
      this.$('#request-verify-call').html(`<div class='container'>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                              </div>`);
      if (number) {
        this.accountManager
          .requestVoiceVerification(number)
          .then(resp => {
            this.$('#request-verify-call').html(i18n('callPhone'));
          })
          .catch(err => {
            console.error('Error requesting Voice verification', err);
            this.$('#request-verify-call').html(i18n('callPhone'));
          });
      }
    },
    onRequestVerifySMS() {
      const number = this.validateNumber();
      this.$('#verify-phone-code').html(`<div class='container'>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                              </div>`);
      if (number) {
        this.accountManager
          .requestSMSVerification(number)
          .then(resp => {
            this.$('#verify-phone-code').html(i18n('verifyPhone'));
          })
          .catch(err => {
            console.error('Error requesting SMS verification', err);
            this.$('#verify-phone-code').html(i18n('verifyPhone'));
          });
      }
    },
    async onCompanySetup() {
      this.setupType = 'company';
      await textsecure.storage.put('setupType', this.setupType);
      this.selectStep(Steps.SETUP_PHONE);
    },
    async onAdminSetup() {
      // TODO: check code is present & valid
      this.setupType = 'admin';
      const codeInvitation = this.$('#admin-signup-code').val();
      // const codeCompany = this.$('#admin-company-code').val();
      // const codeCompany = textsecure.storage.get('companyNumber', false);
      // console.log('CODEEEEE', codeCompany)
      await textsecure.storage.put('setupType', this.setupType);
      await textsecure.storage.put('codeInvitation', codeInvitation.toUpperCase());
      // await textsecure.storage.put('codeCompany', codeCompany);

      this.selectStep(Steps.SETUP_PHONE);
    },
    async onVerifyPhone() {
      // TODO: check phone verification code
      this.$('#verify-phone-code').html(`<div class='container'>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                              </div>`)
      const number = this.validateNumber();
      const code = this.$('#phone-verification-code')
        .val()
        .replace(/\D+/g, '');

      this.accountManager
        .registerSingleDevice(number, code)
        .then(async () => {
          if (this.setupType == 'admin') {
            // const codeCompany = textsecure.storage.get('codeCompany', false);
            const codeInvitation = textsecure.storage.get(
              'codeInvitation',
              false
            );
            const company = await checkCodeInvitation(codeInvitation);
            await textsecure.storage.put(
              'codeCompany',
              company.company_id + ''
            );
            //  textsecure.storage.put('companyNumber', company.company.company_number);
            textsecure.storage.put('companyNumber', company.company_id);
            textsecure.storage.put('role', company.role);
            //  textsecure.storage.put('client_uuid', company.client_uuid);
          }
          this.$('#verify-phone-code').html(i18n('verifyPhone'))
          this.selectStep(
            this.setupType === 'admin'
              ? Steps.SETUP_USER_PROFILE
              : Steps.SETUP_COMPANY_PROFILE
          );
        })
        .catch(err => {
          console.error('Error registering single device', err);
        });
    },
    onChangeAcceptEula() {
      console.log('Change accept eula');
      const check = this.$el.find('#accept-eula-check');
      const button = this.$el.find('#continue-eula');
      if (check.is(':checked')) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    // onEulaScroll() {
    //   const eula = this.$el.find('.eula-text').get(0);
    //   const atBottom = eula.scrollHeight - eula.scrollTop === eula.clientHeight;
    //   // this.model.set('eula_read', atBottom);
    //   const check = this.$el.find('#accept-eula-check');
    //   const button = this.$el.find('#continue-eula');
    //   check.prop('disabled', !atBottom);
    //   if (!atBottom) {
    //     check.prop('checked', false);
    //     button.addClass('disabled');
    //   }
    //   console.log(eula.scrollHeight, eula.scrollTop, eula.clientHeight);
    //   console.log('Eula scroll', atBottom);
    // },
    onContinueEula() {
      const button = this.$el.find('#continue-eula');
      if (button.is('.disabled')) return;
      console.log('Continue eula');
      textsecure.storage.put('eulaAccepted', true).then(() => {
        this.selectStep(Steps.SETUP_TYPE);
      });
    },
    // Functions for upload User Avatar
    onUploadAvatar() {
      this.$('#inputAvatar').click();
    },
    // TODO HOOK API for upload avatar
    async onChoseAvatar() {
      const fileField = this.$('#inputAvatar')[0].files[0];
      // const base64 = await toBase64(fileField);
      let base64 = '';
      const imageType = this.$('#inputAvatar')[0].files[0].type;

      const width = 80;
      const height = 80;
      const fileName = this.$('#inputAvatar')[0].files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(fileField);

      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        // eslint-disable-next-line no-unused-expressions
        (img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(
            async blob => {
              base64 = new File([blob], fileName, {
                type: imageType,
                lastModified: Date.now(),
              });
              base64 = await toBase64(base64);
              // eslint-disable-next-line prefer-destructuring
              base64 = base64.split(',')[1];
              const avatarInfo = {
                userAvatar: base64,
                userAvatarType: imageType.split('/')[1],
              };
              textsecure.storage.put('avatarInfo', avatarInfo);
            },
            imageType,
            1
          );
          // eslint-disable-next-line no-sequences
        }),
          (reader.onerror = error => console.log(error));
      };
    },
    // Functions for upload Company Avatar
    onUploadCompanyAvatar() {
      this.$('#inputCompanyAvatar').click();
    },
    // TODO HOOK API for upload avatar
    async onChoseCompanyAvatar() {
      const fileField = this.$('#inputCompanyAvatar')[0].files[0];
      let base64 = '';
      const imageType = this.$('#inputCompanyAvatar')[0].files[0].type;
      const width = 80;
      const height = 80;
      const fileName = this.$('#inputCompanyAvatar')[0].files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(fileField);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        // eslint-disable-next-line no-unused-expressions
        (img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(
            async blob => {
              base64 = new File([blob], fileName, {
                type: imageType,
                lastModified: Date.now(),
              });
              base64 = await toBase64(base64);
              // eslint-disable-next-line prefer-destructuring
              base64 = base64.split(',')[1];
              const dataCompanyAvatar = {
                companyAvatar: base64,
                companyAvatarType: imageType.split('/')[1],
              };
              textsecure.storage.put('dataCompanyAvatar', dataCompanyAvatar);
            },
            imageType,
            1
          );
          // eslint-disable-next-line no-sequences
        }),
          (reader.onerror = error => console.log(error));
      };
    },
    // Functions for upload documents
    onuploadDocuments() {
      this.$('#inputDocument').click();
    },
    // TODO HOOK API for upload avatar
    async onChoseDocument() {
      const fileField = this.$('#inputDocument');
      const file = fileField.prop('files');
    },
    activateButtonCompanyInfo() {
      const taxNumber = this.$el.find('#tax-number-input')[0].value.length;
      // const taxID = this.$el.find('#tax-id-input')[0].value.length;
      const comercialRegisterId = this.$el.find('#company-register-id-input')[0]
        .value.length;
      const imprint = this.$el.find('#imprint-input')[0].value.length;
      const branch = this.$el.find('#branch-select')[0].value.length;
      const button = this.$el.find('#company-profile-done');
      if (
        taxNumber > 0 &&
        // taxID > 0 &&
        comercialRegisterId > 0 &&
        imprint > 0 &&
        branch > 0
      ) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    activateButtonProfileDetails() {
      const username = this.$el.find('#user-name-input')[0].value.length;
      const button = this.$el.find('#user-profile-done');

      let companyName = '';
      if (this.setupTypeCompany) {
        companyName = this.$el.find('#company-name-input')[0].value.length;
        if (companyName > 0) {
          button.removeClass('disabled');
        } else {
          button.addClass('disabled');
        }
      } else if (this.setupTypeAdmin) {
        if (username > 0) {
          button.removeClass('disabled');
        } else {
          button.addClass('disabled');
        }
      }
    },
    activateButtonBankDetails() {
      const bankIBAN = this.$el.find('#bank-iban-input')[0].value.length;
      const bankBIC = this.$el.find('#bank-bic-input')[0].value.length;
      const button = this.$el.find('#bank-details-done');
      if (bankIBAN > 0 && bankBIC > 0) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    onOpenSelectBranch() {
      Tmp = {
        taxNumber: this.$el.find('#tax-number-input')[0].value,
        // taxID: this.$el.find('#tax-id-input')[0].value,
        comercialRegisterId: this.$el.find('#company-register-id-input')[0]
          .value,
        imprint: this.$el.find('#imprint-input')[0].value,
      };
      this.selectStep(Steps.SETUP_BRANCHEN);
     
    },
    onSelectBranch(e) {
      this.selectStep(Steps.SETUP_COMPANY_PROFILE);
      this.$('#tax-number-input').val(Tmp.taxNumber);
      // this.$('#tax-id-input').val(Tmp.taxID);
      this.$('#company-register-id-input').val(Tmp.comercialRegisterId);
      this.$('#imprint-input').val(Tmp.imprint);
      this.$('#branch-select').val(e.target.textContent);
      this.activateButtonCompanyInfo();
      this.resetTMP();
    },
    searchBranch(e) {
      const value = e.target.value;
      $('#branch-list p').filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    loadCountries() {
      const thisElement = this;
      $.ajax({
        type: 'GET',
        url: 'config/countries_de.json', // Using our resources.json file to serve results
        success: result => {
          const countries = JSON.parse(result);
          countries.sort((a, b) => {
            return a['name'] > b['name'] ? 1 : a['name'] < b['name'] ? -1 : 0;
          });
          for (let i = 0; i < countries.length; i++) {
            const pItem = `<p class="pCountry" data-country-code="${
              countries[i].code
            }" data-dial-code="${countries[i].dial_code}">${
              countries[i].name
            } <span class="spanDialCode">${countries[i].dial_code}</span></p>`;
            thisElement.$('#phone-list').append(pItem);
          }
        },
        error: e => {
          console.log('Error getting countries', e);
        },
      });
    },
    onOpenSelectPhoneList() {
      this.loadCountries();
      Tmp = {
        phoneNumber: this.$el.find('#phone-number-value')[0].value,
      };
      this.selectStep(Steps.SETUP_PHONESLIST);
    },
    onSelectPhone(e) {
      this.selectStep(Steps.SETUP_PHONE);
      this.$('#countryCode').text(
        `${e.target.getAttribute('data-country-code')}`
      );
      this.$('#dialCode').text(` ${e.target.getAttribute('data-dial-code')}`);
      this.$('#phone-number-value').val(Tmp.phoneNumber);
      this.activateButtonVerifyCall();
      this.resetTMP();
    },
    searchPhones(e) {
      var value = e.target.value;
      $('#phone-list p').filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    activateButtonVerifyCall() {
      const number = this.$el.find('#phone-number-value')[0].value.length;
      const button = this.$el.find('#request-verify-call');
      if (number > 0) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    activateButtonVerifyCode() {
      const code = this.$el.find('#phone-verification-code')[0].value.length;
      const button = this.$el.find('#verify-phone-code');
      if (code > 0) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    activateButtonRegisterAdminClient() {
      const code = this.$el.find('#admin-signup-code')[0].value.length;
      // const Companycode = this.$el.find('#admin-company-code')[0].value.length;
      const button = this.$el.find('#continue-setup-admin');
      if (code > 0) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    resetTMP() {
      Tmp = {};
    },
    render_attributes() {
      return {
        appTagLine: i18n('appTagLine'),
        appTagLineSecond:i18n('appTagLineSecond'),
        eulaTitle: i18n('eulaTitle'),
        eulaSubTitle: i18n('eulaSubTitle'),
        acceptEula: i18n('acceptEula'),
        registerCompany: i18n('registerCompany'),
        registerAdmin: i18n('registerAdmin'),
        welcomeCompany: i18n('welcomeCompany'),
        welcomeAdmin: i18n('welcomeAdmin'),
        continueButton: i18n('continueButton'),
        signupCode: i18n('signupCode'),
        companyCode: i18n('companyCode'),
        phoneSetupTitle: i18n('phoneSetupTitle'),
        phoneSetupSubtitle: i18n('phoneSetupSubtitle'),
        phoneNumber: i18n('phoneNumber'),
        countryCode: i18n('countryCode'),
        verifyCode: i18n('verifyCode'),
        callPhone: i18n('callPhone'),
        sendSMSInstead: i18n('sendSMSInstead'),
        verifyPhone: i18n('verifyPhone'),
        companyDetails: i18n('companyDetails'),
        companyName: i18n('companyName'),
        taxNumber: i18n('taxNumber'),
        // taxID: i18n('taxID'),
        companyRegistrationID: i18n('companyRegistrationID'),
        imprint: i18n('imprint'),
        branch: i18n('branch'),
        uploadCompanyRegister: i18n('uploadCompanyRegister'),
        userProfile: i18n('userProfile'),
        userName: i18n('userName'),
        bankDetails: i18n('bankDetails'),
        notNow: i18n('notNow'),
        contactImportTitle: i18n('contactImportTitle'),
        selectFileToUpload: i18n('selectFileToUpload'),
        noFileChosen: i18n('noFileChosen'),
        uploadCard: i18n('uploadCard'),
        uploadCompanyAvatarText: i18n('uploadCompanyAvatarText'),

        isStepEula: this.step === Steps.ACCEPT_EULA,
        isStepSetupType: this.step === Steps.SETUP_TYPE,
        isStepSetupPhone: this.step === Steps.SETUP_PHONE,
        isStepSetupCompanyProfile: this.step === Steps.SETUP_COMPANY_PROFILE,
        isStepSetupCompanyBank: this.step === Steps.SETUP_COMPANY_BANK,
        isStepSetupUserProfile: this.step === Steps.SETUP_USER_PROFILE,
        isStepSetupContactImport: this.step === Steps.SETUP_CONTACT_IMPORT,
        isStepSetupBranchen: this.step === Steps.SETUP_BRANCHEN,
        isStepSetupPhoneList: this.step === Steps.SETUP_PHONESLIST,
        setupTypeAdmin: this.setupTypeAdmin,
        setupTypeCompany: this.setupTypeCompany,
        EULAText: EULA,
        uploadAvatarText: i18n('uploadAvatarText'),
        BranchenTitle: i18n('BranchenTitle'),
        BranchOption1: i18n('BranchOption1'),
        BranchOption2: i18n('BranchOption2'),
        BranchOption3: i18n('BranchOption3'),
        BranchOption4: i18n('BranchOption4'),
        BranchOption5: i18n('BranchOption5'),
        BranchOption6: i18n('BranchOption6'),
        BranchOption7: i18n('BranchOption7'),
        BranchOption8: i18n('BranchOption8'),
        BranchOption9: i18n('BranchOption9'),
        BranchOption10: i18n('BranchOption10'),
        BranchOption11: i18n('BranchOption11'),
        BranchOption12: i18n('BranchOption12'),
        BranchOption13: i18n('BranchOption13'),
        BranchOption14: i18n('BranchOption14'),
        BranchOption15: i18n('BranchOption15'),
        BranchOption16: i18n('BranchOption16'),
        BranchOption17: i18n('BranchOption17'),
        BranchOption18: i18n('BranchOption18'),
        BranchOption19: i18n('BranchOption19'),
        BranchOption20: i18n('BranchOption20'),
        BranchOption21: i18n('BranchOption21'),
        BranchOption22: i18n('BranchOption22'),
        BranchOption23: i18n('BranchOption23'),
        BranchOption24: i18n('BranchOption24'),
        BranchOption25: i18n('BranchOption25'),
        BranchOption26: i18n('BranchOption26'),
        BranchOption27: i18n('BranchOption27'),
        BranchOption28: i18n('BranchOption28'),
        BranchOption29: i18n('BranchOption29'),
        BranchOption30: i18n('BranchOption30'),
        BranchOption31: i18n('BranchOption31'),
        BranchOption32: i18n('BranchOption32'),
        BranchOption33: i18n('BranchOption33'),
        BranchOption34: i18n('BranchOption34'),
        BranchOption35: i18n('BranchOption35'),
        BranchOption36: i18n('BranchOption36'),
        BranchOption37: i18n('BranchOption37'),
        BranchOption38: i18n('BranchOption38'),
        BranchOption39: i18n('BranchOption39'),
        BranchOption40: i18n('BranchOption40'),
        BranchOption41: i18n('BranchOption41'),
        BranchOption42: i18n('BranchOption42'),
        PhonesTitle: i18n('PhonesTitle'),
      };
    },
  });
})();
