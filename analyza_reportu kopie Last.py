import imaplib
import email
from email.header import decode_header
import os
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import glob

# Přihlašovací údaje k Gmail účtu
username = "aikittest@gmail.com"  # Tvůj Gmail účet
password = "qwztlnpbgcfitxrb"  # Heslo pro aplikaci (bez mezer)

# Cesta ke složce, kam chceme ukládat přílohy
folder_path = 'C:/Users/mykha/Desktop/Programovani/SQS Spam - S2N2 (1)'

# Funkce pro kontrolu emailů a stažení příloh
def check_emails():
    print("Kontroluji nové emaily...")

    # Připojení k serveru IMAP pro Gmail
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(username, password)

    # Vyber složku s přijatými emaily
    mail.select("inbox")

    # Vyhledání všech nepřečtených emailů
    status, messages = mail.search(None, 'UNSEEN')  # Vyhledáváme pouze nepřečtené emaily

    # Kontrola, zda existují nové emaily
    if not messages[0]:
        print("Žádné nové emaily nebyly nalezeny. Ukončuji skript.")
        mail.logout()
        return  # Ukončení funkce a skriptu, pokud nejsou žádné nové emaily

    # Pokud jsou nalezeny nové emaily, pokračujeme ve zpracování
    print("Nové emaily nalezeny. Zpracovávám...")

    # Zpracuj každý email
    for num in messages[0].split():
        status, msg_data = mail.fetch(num, "(RFC822)")
        msg = email.message_from_bytes(msg_data[0][1])

        # Načti datum přijetí emailu
        date_tuple = email.utils.parsedate_tz(msg["Date"])
        if date_tuple:
            email_date = datetime.fromtimestamp(email.utils.mktime_tz(date_tuple))
            date_str = email_date.strftime("%Y-%m-%d_%H-%M-%S")

        # Projdi všechny části emailu a najdi přílohy
        for part in msg.walk():
            if part.get_content_disposition() == "attachment":
                filename = part.get_filename()
                # Pokud příloha má název, ulož ji
                if filename:
                    # Přidání data přijetí emailu k názvu souboru
                    filepath = os.path.join(folder_path, f"{date_str}_{filename}")
                    with open(filepath, "wb") as f:
                        f.write(part.get_payload(decode=True))
                    print(f"Příloha '{filename}' byla uložena do složky jako '{filepath}'.")

    # Odhlášení z emailového účtu
    mail.logout()

    # Následné zpracování souborů v cílové složce
    # Najdi všechny txt soubory ve složce
    all_files = glob.glob(os.path.join(folder_path, '*.txt'))

    # Seznam pro uložení jednotlivých dataframů z každého souboru
    data_frames = []

    # Načti každý soubor a přidej jej do seznamu
    for file in all_files:
        print(f"Načítám soubor: {file}")
        df = pd.read_csv(file, delimiter=',', quotechar='"')
        data_frames.append(df)

    # Spoj všechny dataframy dohromady
    if data_frames:  # Zkontroluj, zda jsou načteny nějaké soubory
        data = pd.concat(data_frames, ignore_index=True)

        # Odstranění řádků s neplatnými časovými hodnotami
        data = data[data['TS'] != "++++++++"]

        # Převod sloupce 'TS' na datetime
        data['TS'] = pd.to_datetime(data['TS'], errors='coerce')
        data = data.dropna(subset=['TS'])

        # Přidání sloupce s pouze datem (bez času) pro skupinovou analýzu po dnech
        data['Date'] = data['TS'].dt.date

        # Skupinová analýza: sumarizace počtu chyb podle submise (SUB) a data
        daily_counts = data.groupby(['Date', 'SUB'])['COUNT'].sum().unstack().fillna(0)

        print("Data po denní analýze:")
        print(daily_counts.head())

        # Vytvoření sloupcového grafu pro každý typ submise (SUB)
        fig, ax = plt.subplots(figsize=(12, 6))
        daily_counts.plot(kind='bar', stacked=True, ax=ax, colormap='tab20')

        plt.xlabel('Datum')
        plt.ylabel('Statistiky počtu chyb')
        plt.title('Počet chyb podle submisi v různých dnech roku na SQS nodu')
        plt.xticks(rotation=45)
        plt.legend(title='Submise')
        plt.tight_layout()

        # Přidání menšího loga nad grafem v levém horním rohu
        logo_path = 'C:/Users/mykha/Desktop/Programovani/logo.png'  # Cesta k logu
        logo = mpimg.imread(logo_path)  # Načti obrázek loga
        newax = fig.add_axes([0.02, 0.89, 0.1, 0.1], anchor='NW', zorder=1)  # Osa posunuta výše pomocí 0.89
        newax.imshow(logo)
        newax.axis('off')  # Skryje osy kolem loga

        plt.show()
    else:
        print("Žádné soubory pro analýzu nebyly nalezeny.")

# Spusť funkci check_emails()
check_emails()
